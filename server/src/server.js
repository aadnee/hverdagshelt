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
import userManager from './managers/userManager';
import newsManager from './managers/newsManager';
import ticketManager from './managers/ticketManager';
import subscriptionManager from './managers/subscriptionManager';
import municipalManager from './managers/municipalManager';
import categoryManager from './managers/categoryManager';
import companyManager from './managers/companyManager';
import eventManager from './managers/eventManager';
import { syncDatabase } from './models';
syncDatabase(res => console.log(res));

const public_path = path.join(__dirname, '/../../client/public');

let storage = multer.diskStorage({
  destination: '../client/public/uploads/',
  filename: function(req, file, cb) {
    let fileParts = file.originalname.split('.');
    let ext = fileParts.pop();
    let name = Math.random()
      .toString(36)
      .substr(2, 5);
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});
let upload = multer({ storage: storage });

let app = express();
app.use(express.static(public_path));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

app.get('/api/pdf', (req, res) => {
  ticketManager.getTicketStatistics(1, 2019, null, 4, function(result) {
    ejs.renderFile('./pdfs/file.ejs', { categories: result.data, start: result.start, end: result.end }, function(
      err,
      html
    ) {
      let config = {
        format: 'A4',
        orientation: 'portrait',
        border: {
          top: '10mm',
          right: '30mm',
          bottom: '10mm',
          left: '30mm'
        },
        timeout: 30000,
        renderDelay: 2000
      };
      let filepath = './pdfs/file.pdf';
      pdf.create(html, config).toFile(filepath, function(err, file) {
        res.json({ filename: file.filename });
      });
    });
  });
});

app.get('/api/pdf/html', (req, res) => {
  let municipalId = 1;
  ticketManager.getTicketStatistics(1, 2019, null, 4, function(result) {
    ejs.renderFile('./pdfs/file.ejs', { categories: result.data, start: result.start, end: result.end }, function(
      err,
      html
    ) {
      res.send(html);
    });
  });
});

app.post('/api/events/filter', (req, res) => {
  let b = req.body;
  eventManager.getFilteredEvents(b.municipalIds, b.page, b.limit, function(result) {
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

app.post('/api/news/filter', (req, res) => {
  let b = req.body;
  newsManager.getFilteredNews(b.municipalIds, b.categoryIds, b.page, b.limit, function(result) {
    res.json(result);
  });
});

app.post('/api/news/archive', (req, res) => {
  let b = req.body;
  newsManager.getArchivedNews(b.municipalIds, function(result) {
    res.json(result);
  });
});

app.put('/api/news/:id', ensureEmployee, (req, res) => {
  let b = req.body;
  let p = req.params;
  newsManager.updateNews(p.id, b.title, b.description, b.status, b.categoryId, b.companyId, function(result) {
    res.json(result);
  });
});

app.post('/api/news', ensureEmployee, (req, res) => {
  let b = req.body;
  newsManager.addArticle(b.title, by.description, b.categoryId, b.lat, b.lon, b.address, b.municipalId, function(
    result
  ) {
    res.json(result);
  });
});

app.post('/api/login', (req, res) => {
  let b = req.body;
  userManager.login(b.email, b.password, function(result) {
    res.cookie('token', result.token);
    res.cookie('rank', result.rank);
    res.cookie('municipalId', result.municipalId);
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
  userManager.editUser(b.name, b.email, b.phone, b.municipalId, p.id, b.rank, function(result) {
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
  let p = req.params;
  getUserId(req, function(userId) {
    companyManager.rejectTask(userId, p.newsId, function(result) {
      res.json(result);
    });
  });
});

app.put('/api/tasks/:newsId/finish', ensureLogin, (req, res) => {
  let p = req.params;
  getUserId(req, function(userId) {
    companyManager.finishTask(userId, p.newsId, function(result) {
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
  companyManager.editCompany(b.name, b.email, b.phone, b.municipalId, p.id, function(result) {
    res.json(result);
  });
});

app.get('/api/companies/municipal/:municipalId', ensureEmployee, (req, res) => {
  let p = req.params;
  companyManager.getLocalCompanies(p.municipalId, function(result) {
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
      b.municipalId,
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
  ticketManager.setStatus(4, p.ticketId, null, function(result) {
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
  ticketManager.setStatus(3, p.ticketId, b.newsId, function(result) {
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
  ticketManager.getPendingTicketCount(function(result) {
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

app.post('/api/subscriptions', ensureAdmin, (req, res) => {
  let b = req.body;
  subscriptionManager.addSubscription(b.newsId, b.userId, function(result) {
    res.json(result);
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

// Hot reload application when not in production environment
if (process.env.NODE_ENV !== 'production') {
  let reloadServer = reload(app);
  fs.watch(public_path, () => reloadServer.reload());
}

http.createServer(app).listen(3000);

const options = {
  key: fs.readFileSync('./src/security/private.key'),
  cert: fs.readFileSync('./src/security/certificate.crt')
};

https.createServer(options, app).listen(3001);
console.log('Server listening.');
