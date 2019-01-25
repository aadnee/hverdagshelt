import express from 'express';
import path from 'path';
import http from 'http';
import https from 'https';
import reload from 'reload';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import cors from 'cors';
import pdf from 'html-pdf';
import ejs from 'ejs';
import utmObj from 'utm-latlng';
import { CronJob } from 'cron';
import userManager from './managers/userManager';
import newsManager from './managers/newsManager';
import ticketManager from './managers/ticketManager';
import subscriptionManager from './managers/subscriptionManager';
import municipalManager from './managers/municipalManager';
import categoryManager from './managers/categoryManager';
import companyManager from './managers/companyManager';
import eventManager from './managers/eventManager';
import { syncDatabase } from './models';

syncDatabase(res => {
  console.log(res);
  fs.readFile('src/testdata/vegvesen.json', 'utf8', function(err, data) {
    if (err) throw err;
    let reps = JSON.parse(data).Reports;
    let utm = new utmObj();
    reps.map(rep => {
      let coords = utm.convertUtmToLatLng(rep.Easting, rep.Northing, 33, 'N');
      if (rep.Status == 'new') {
        ticketManager.addTicket(
          rep.Subject,
          'Beskrivelse her',
          coords.lat,
          coords.lng,
          'Hjemme hos ' + rep.ReporterName,
          Math.floor(Math.random() * 10) + 7,
          'Trondheim',
          1,
          [],
          3,
          function(result) {}
        );
      } else {
        newsManager.addArticle(
          rep.Subject,
          'Beskrivelse her',
          Math.floor(Math.random() * 10) + 7,
          coords.lat,
          coords.lng,
          'Hjemme hos ' + rep.ReporterName,
          1,
          function() {}
        );
      }
    });
  });
});

let public_path = path.join(__dirname, '/../../client/public');
let app = express();

app.use(express.static(public_path));
app.use(express.json());
app.set('json spaces', 2);
app.use(cookieParser());
app.use(cors());

let upload = multer({
  storage: multer.diskStorage({
    destination: '../client/public/uploads/',
    filename: function(req, file, cb) {
      let fileParts = file.originalname.split('.');
      let ext = fileParts.pop();
      let name = Math.random()
        .toString(36)
        .substr(2, 5);
      cb(null, name + '-' + Date.now() + '.' + ext);
    }
  })
});

app.post('/api/statistics/:municipalId', (req, res) => {
  let b = req.body;
  let p = req.params;

  ticketManager.getTicketStatistics(p.municipalId, b.year, b.month, b.week, function(cats) {
    userManager.userIncrease(p.municipalId, b.year, b.month, b.week, function(users) {
      let period = b.month ? b.month + ' / 2019' : b.week ? 'uke ' + b.week + ' 2019' : b.year;
      let projectRoot = process.cwd();
      projectRoot = projectRoot.replace(/\\/g, '/');
      let link = 'file:///' + projectRoot + '/pdfs/';
      ejs.renderFile(
        './pdfs/file.ejs',
        { categories: cats.data, users: users, start: cats.start, end: cats.end, period: period, link: link },
        function(err, html) {
          let config = {
            format: 'A4',
            orientation: 'portrait',
            border: {
              top: '20mm',
              right: '30mm',
              bottom: '20mm',
              left: '30mm'
            },
            timeout: 30000,
            renderDelay: 5000
          };
          let filepath = './pdfs/file.pdf';
          pdf.create(html, config).toStream(function(err, stream) {
            if (err) {
              console.log(err);
            } else {
              res.set('Content-type', 'application/pdf');
              stream.pipe(res);
            }
          });
        }
      );
    });
  });
});

app.post('/api/events/filter', (req, res) => {
  let b = req.body;
  eventManager.getFilteredEvents(b.municipalIds, b.page, b.limit, function(result) {
    res.json(result);
  });
});

app.get('/api/events', (req, res) => {
  eventManager.getEvents(function(result) {
    res.json(result);
  });
});

app.post('/api/events', ensureEmployee, (req, res) => {
  let b = req.body;
  eventManager.addEvent(b.title, b.description, b.area, b.address, b.start, b.end, b.municipalId, b.url, function(
    result
  ) {
    res.json(result);
  });
});

app.put('/api/events/:eventId', ensureEmployee, (req, res) => {
  let b = req.body;
  let p = req.params;
  eventManager.editEvent(
    p.eventId,
    b.title,
    b.description,
    b.area,
    b.address,
    b.start,
    b.end,
    b.municipalId,
    b.url,
    function(result) {
      res.json(result);
    }
  );
});

app.delete('/api/events/:eventId', ensureEmployee, (req, res) => {
  let p = req.params;
  eventManager.deleteEvent(p.eventId, function(result) {
    res.json(result);
  });
});

app.get('/api/news', (req, res) => {
  newsManager.getNews(function(result) {
    res.json(result);
  });
});

app.get('/api/news/:newsId', (req, res) => {
  let p = req.params;
  newsManager.getArticle(p.newsId, function(result) {
    res.json(result);
  });
});

app.post('/api/news/filter', (req, res) => {
  let b = req.body;
  newsManager.getFilteredNews(b.municipalIds, b.categoryIds, b.page, b.limit, function(result) {
    res.json(result);
  });
});

app.post('/api/news/archive', (req, res) => {
  let b = req.body;
  newsManager.getArchivedNews(b.municipalIds, b.categoryIds, b.page, b.limit, function(result) {
    res.json(result);
  });
});

app.put('/api/news/:id', ensureEmployee, (req, res) => {
  let b = req.body;
  let p = req.params;
  newsManager.updateNews(p.id, b.title, b.description, b.categoryId, function(result) {
    res.json(result);
  });
});

app.put('/api/news/:id/finish', ensureEmployee, (req, res) => {
  let p = req.params;
  newsManager.finishNews(p.id, function(result) {
    res.json(result);
  });
});

app.put('/api/news/:id/company', ensureEmployee, (req, res) => {
  let b = req.body;
  let p = req.params;
  newsManager.assignCompany(p.id, b.companyId, function(result) {
    res.json(result);
  });
});

app.post('/api/login', (req, res) => {
  let b = req.body;
  userManager.login(b.email, b.password, function(result) {
    if (result.token) {
      res.cookie('token', result.token);
      res.cookie('rank', result.rank);
      res.cookie('municipalId', result.municipalId);
    }
    res.json(result);
  });
});

app.post('/api/register', (req, res) => {
  let b = req.body;
  userManager.register(b.name, b.email, b.phone, b.municipalId, 1, function(result) {
    res.json(result);
  });
});

app.post('/api/reset/send', (req, res) => {
  let b = req.body;
  userManager.sendReset(b.email, function(result) {
    res.json(result);
  });
});

app.post('/api/reset/confirm', (req, res) => {
  let b = req.body;
  userManager.resetPassword(b.email, b.key, function(result) {
    res.json(result);
  });
});

app.get('/api/me', ensureLogin, (req, res) => {
  getUserId(req, function(userId) {
    userManager.getUser(userId, function(result) {
      res.json(result);
    });
  });
});

app.put('/api/me', ensureLogin, (req, res) => {
  let b = req.body;
  getUserId(req, function(userId) {
    getUserRank(req, function(userRank) {
      userManager.editUser(b.name, b.email, b.phone, b.municipalId, userId, b.notifications, userRank, function(
        result
      ) {
        if (b.oldPassword && b.newPassword && b.oldPassword != '' && b.newPassword != '') {
          userManager.changePass(userId, b.oldPassword, b.newPassword, function(result) {
            res.json(result);
          });
        } else {
          res.json(result);
        }
      });
    });
  });
});

app.get('/api/users', ensureAdmin, (req, res) => {
  userManager.getUsers(function(result) {
    res.json(result);
  });
});

app.get('/api/users/:id', ensureAdmin, (req, res) => {
  let p = req.params;
  userManager.getUser(p.id, function(result) {
    res.json(result);
  });
});

app.delete('/api/users/:id', ensureAdmin, (req, res) => {
  let p = req.params;
  userManager.deleteUser(p.id, function(result) {
    res.json(result);
  });
});

app.put('/api/users/:id', ensureAdmin, (req, res) => {
  let b = req.body;
  let p = req.params;
  userManager.editUser(b.name, b.email, b.phone, b.municipalId, p.id, b.notifications, b.rank, function(result) {
    res.json(result);
  });
});

app.get('/api/tasks', ensureLogin, (req, res) => {
  getUserId(req, function(userId) {
    companyManager.getTasks(userId, function(result) {
      res.json(result);
    });
  });
});

app.put('/api/tasks/:newsId/accept', ensureLogin, (req, res) => {
  let p = req.params;
  getUserId(req, function(userId) {
    companyManager.acceptTask(userId, p.newsId, function(result) {
      res.json(result);
    });
  });
});

app.put('/api/tasks/:newsId/reject', ensureLogin, (req, res) => {
  let b = req.body;
  let p = req.params;
  getUserId(req, function(userId) {
    companyManager.rejectTask(userId, p.newsId, b.feedback, function(result) {
      res.json(result);
    });
  });
});

app.put('/api/tasks/:newsId/finish', ensureLogin, (req, res) => {
  let b = req.body;
  let p = req.params;
  getUserId(req, function(userId) {
    companyManager.finishTask(userId, p.newsId, b.feedback, function(result) {
      res.json(result);
    });
  });
});

app.get('/api/companies', ensureEmployee, (req, res) => {
  companyManager.getCompanies(function(result) {
    res.json(result);
  });
});

app.get('/api/companies/:companyId', ensureEmployee, (req, res) => {
  let p = req.params;
  companyManager.getCompany(p.companyId, function(result) {
    res.json(result);
  });
});

app.delete('/api/companies/:id', ensureEmployee, (req, res) => {
  let p = req.params;
  companyManager.deleteCompany(p.id, function(result) {
    res.json(result);
  });
});

app.post('/api/companies', ensureEmployee, (req, res) => {
  let b = req.body;
  companyManager.addCompany(b.name, b.email, b.phone, b.municipalId, function(result) {
    res.json(result);
  });
});

app.put('/api/companies/:id', ensureEmployee, (req, res) => {
  let b = req.body;
  let p = req.params;
  companyManager.editCompany(b.name, b.email, b.phone, b.municipalId, b.notifications, p.id, function(result) {
    res.json(result);
  });
});

app.get('/api/companies/municipal/:municipalId', ensureEmployee, (req, res) => {
  let p = req.params;
  companyManager.getLocalCompanies(p.municipalId, function(result) {
    res.json(result);
  });
});

app.get('/api/companies/check', ensureEmployee, (req, res) => {
  companyManager.checkTimeLimits(function(result) {
    res.json(result);
  });
});

app.post('/api/tickets', ensureLogin, upload.array('images', 12), (req, res) => {
  let b = req.body;
  getUserId(req, function(userId) {
    ticketManager.addTicket(
      b.title,
      b.description,
      b.lat,
      b.lon,
      b.address,
      b.categoryId,
      b.municipalName,
      b.subscribed,
      req.files,
      userId,
      function(result) {
        res.json(result);
      }
    );
  });
});

app.put('/api/tickets/:ticketId', ensureLogin, (req, res) => {
  let b = req.body;
  let p = req.params;
  getUserId(req, function(userId) {
    ticketManager.editTicket(
      b.title,
      b.description,
      b.lat,
      b.lon,
      b.address,
      b.categoryId,
      b.municipalId,
      b.subscribed,
      userId,
      p.ticketId,
      function(result) {
        res.json(result);
      }
    );
  });
});

app.put('/api/tickets/:ticketId/reject', ensureEmployee, (req, res) => {
  let p = req.params;
  let b = req.body;
  ticketManager.setStatus(4, p.ticketId, null, b.feedback, function(result) {
    res.json(result);
  });
});

app.delete('/api/tickets/:ticketId/withdraw', ensureLogin, (req, res) => {
  let p = req.params;
  getUserId(req, function(userId) {
    ticketManager.withdraw(userId, p.ticketId, function(result) {
      res.json(result);
    });
  });
});

app.put('/api/tickets/:ticketId/accept', ensureEmployee, (req, res) => {
  let b = req.body;
  let p = req.params;
  ticketManager.makeNews(
    p.ticketId,
    b.title,
    b.description,
    b.lat,
    b.lon,
    b.address,
    b.categoryId,
    b.municipalId,
    b.imageIds ? b.imageIds : [],
    function(result) {
      res.json(result);
    }
  );
});

app.put('/api/tickets/:ticketId/link', ensureEmployee, (req, res) => {
  let b = req.body;
  let p = req.params;
  ticketManager.setStatus(3, p.ticketId, b.newsId, null, function(result) {
    res.json(result);
  });
});

app.get('/api/mytickets', ensureLogin, (req, res) => {
  getUserId(req, function(userId) {
    ticketManager.getMyTickets(userId, function(result) {
      res.json(result);
    });
  });
});

app.get('/api/tickets/municipal/:municipalId', ensureEmployee, (req, res) => {
  let p = req.params;
  ticketManager.getLocalTickets(p.municipalId, function(result) {
    res.json(result);
  });
});

app.get('/api/categories', (req, res) => {
  categoryManager.getCategories(function(result) {
    res.json(result);
  });
});

app.get('/api/tickets/pending', ensureEmployee, (req, res) => {
  ticketManager.getPendingTicketCount(req.cookies['municipalId'], function(result) {
    res.json(result);
  });
});

app.get('/api/categories', ensureLogin, (req, res) => {
  categoryManager.getCategories(function(result) {
    res.json(result);
  });
});

app.delete('/api/categories/:id', ensureAdmin, (req, res) => {
  let p = req.params;
  categoryManager.deleteCategory(p.id, function(result) {
    res.json(result);
  });
});

app.put('/api/categories/:id', ensureAdmin, (req, res) => {
  let b = req.body;
  let p = req.params;
  categoryManager.editCategory(p.id, b.name, function(result) {
    res.json(result);
  });
});

app.post('/api/categories', ensureAdmin, (req, res) => {
  let b = req.body;
  categoryManager.addCategory(b.name, b.parentId, function(result) {
    res.json(result);
  });
});

app.get('/api/municipals', (req, res) => {
  municipalManager.getMunicipals(function(result) {
    res.json(result);
  });
});

app.post('/api/municipals', ensureAdmin, (req, res) => {
  let b = req.body;
  municipalManager.addMunicipal(b.name, function(result) {
    res.json(result);
  });
});

app.get('/api/subscriptions', ensureLogin, (req, res) => {
  getUserId(req, function(userId) {
    subscriptionManager.getSubscriptions(userId, function(result) {
      res.json(result);
    });
  });
});

app.post('/api/subscriptions', ensureLogin, (req, res) => {
  let b = req.body;
  getUserId(req, function(userId) {
    subscriptionManager.addSubscription(b.newsId, userId, function(result) {
      res.json(result);
    });
  });
});

app.delete('/api/subscriptions/:newsId', ensureLogin, (req, res) => {
  let p = req.params;
  getUserId(req, function(userId) {
    subscriptionManager.deleteSubscription(p.newsId, userId, function(result) {
      res.json(result);
    });
  });
});

app.get('/api/mymunicipals', ensureLogin, (req, res) => {
  getUserId(req, function(userId) {
    userManager.getMunicipals(userId, function(result) {
      res.json(result);
    });
  });
});

app.post('/api/mymunicipals', ensureLogin, (req, res) => {
  let b = req.body;
  getUserId(req, function(userId) {
    userManager.addMunicipal(userId, b.municipalId, function(result) {
      res.json(result);
    });
  });
});

app.delete('/api/mymunicipals/:municipalId', ensureLogin, (req, res) => {
  let p = req.params;
  getUserId(req, function(userId) {
    userManager.deleteMunicipal(userId, p.municipalId, function(result) {
      res.json(result);
    });
  });
});

//statistics

// Returns number of tickets sent in per category for the given municipal
// Returns yearly numbers if month and week is null, returns monthly if only week is null
app.post('/api/statistics/tickets', ensureEmployee, (req, res) => {
  let b = req.body;
  ticketManager.getTicketStatistics(b.municipalId, b.year, b.month, b.week, function(result) {
    res.json(result);
  });
});

app.post('/api/statistics/users', ensureEmployee, (req, res) => {
  let b = req.body;
  userManager.userIncrease(b.municipalId, b.year, b.month, b.week, function(result) {
    res.json(result);
  });
});

//statistics

function getUserId(req, callback) {
  jwt.verify(req.cookies['token'], process.env.JWT, function(err, decoded) {
    callback(decoded.id);
  });
}

function getUserRank(req, callback) {
  jwt.verify(req.cookies['token'], process.env.JWT, function(err, decoded) {
    callback(decoded.rank);
  });
}

function ensureLogin(req, res, next) {
  jwt.verify(req.cookies['token'], process.env.JWT, function(err, decoded) {
    if (decoded && decoded.id) {
      next();
    } else {
      res.clearCookie('token');
      res.clearCookie('rank');
      res.clearCookie('municipalId');
      res.sendStatus(403);
    }
  });
}

function ensureEmployee(req, res, next) {
  jwt.verify(req.cookies['token'], process.env.JWT, function(err, decoded) {
    if (decoded && decoded.rank && decoded.rank >= 3) {
      next();
    } else {
      res.sendStatus(403);
    }
  });
}

function ensureAdmin(req, res, next) {
  jwt.verify(req.cookies['token'], process.env.JWT, function(err, decoded) {
    if (decoded && decoded.rank && decoded.rank >= 4) {
      next();
    } else {
      res.sendStatus(403);
    }
  });
}

if (process.env.NODE_ENV !== 'production') {
  let reloadServer = reload(app);
  fs.watch(public_path, () => reloadServer.reload());
}

const options = {
  key: fs.readFileSync('./src/security/private.key'),
  cert: fs.readFileSync('./src/security/certificate.crt')
};
http.createServer(app).listen(3000);
https.createServer(options, app).listen(3001);

var job = new CronJob(
  '00 00 00 * * 1-7',
  function() {
    companyManager.checkTimeLimits(result => {});
  },
  function() {
    console.error('Stopped checking assigned tasks for companies.');
  },
  true,
  'Europe/Amsterdam'
);

console.log('Server listening.');
