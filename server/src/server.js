import express from 'express';
import path from 'path';
import http from 'http';
import https from 'https';
import reload from 'reload';
import fs from 'fs';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { Users } from './models.js';
import userManager from './managers/userManager';
import newsManager from './managers/newsManager';
import ticketManager from './managers/ticketManager';
import subscriptionManager from './managers/subscriptionManager';
import municipalManager from './managers/municipalManager';
import categoryManager from './managers/categoryManager';
import companyManager from './managers/companyManager';

const public_path = path.join(__dirname, '/../../client/public');

let app = express();

let storage = multer.diskStorage({
  destination: './uploads/',
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});
let upload = multer({ storage: storage });

app.use(express.static(public_path));
app.use(express.json());
app.use(cookieParser());

app.get('/api/news/municipal/:municipalId', function(req, res) {
  newsManager.getLocalNews(req.params.municipalId, function(result) {
    res.json(result);
  });
});

app.put('/api/news/:id', ensureEmployee, function(req, res) {
  newsManager.updateNews(
    req.params.id,
    req.body.title,
    req.body.description,
    req.body.status,
    req.body.categoryId,
    req.body.companyId,
    function(result) {
      res.json(result);
    }
  );
});

app.post('/api/news', ensureEmployee, function(req, res) {
  newsManager.addArticle(
    req.body.title,
    req.body.description,
    req.body.categoryId,
    req.body.lat,
    req.body.lon,
    req.body.municipalId,
    function(result) {
      res.json(result);
    }
  );
});

app.post('/api/login', function(req, res) {
  userManager.login(req.body.email, req.body.password, function(result) {
    res.cookie('token', result.token);
    res.cookie('rank', result.rank);
    res.cookie('municipalId', result.municipalId);
    res.json(result);
  });
});

app.post('/api/register', function(req, res) {
  userManager.register(req.body.name, req.body.email, req.body.phone, req.body.municipalId, 1, function(result) {
    res.json(result);
  });
});

app.get('/api/me', ensureLogin, function(req, res) {
  getUserId(req, function(userId) {
    userManager.getUser(userId, function(result) {
      res.json(result);
    });
  });
});

app.put('/api/me', ensureLogin, function(req, res) {
  getUserId(req, function(userId) {
    getUserRank(req, function(userRank) {
      userManager.editUser(
        req.body.name,
        req.body.email,
        req.body.phone,
        req.body.municipalId,
        userId,
        userRank,
        function(result) {
          if (
            req.body.oldPassword &&
            req.body.newPassword &&
            req.body.oldPassword != '' &&
            req.body.newPassword != ''
          ) {
            userManager.changePass(userId, req.body.oldPassword, req.body.newPassword, function(result2) {
              res.json(result2);
            });
          } else {
            res.json(result);
          }
        }
      );
    });
  });
});

app.get('/api/users', ensureAdmin, (req, res) => {
  userManager.getUsers(function(result) {
    res.json(result);
  });
});

app.get('/api/users/:id', ensureAdmin, (req, res) => {
  userManager.getUser(req.params.id, function(result) {
    res.json(result);
  });
});

app.delete('/api/users/:id', ensureAdmin, (req, res) => {
  userManager.deleteUser(req.params.id, function(result) {
    res.json(result);
  });
});

app.put('/api/users/:id', ensureAdmin, function(req, res) {
  userManager.editUser(
    req.body.name,
    req.body.email,
    req.body.phone,
    req.body.municipalId,
    req.params.id,
    req.body.rank,
    function(result) {
      res.json(result);
    }
  );
});

app.get('/api/companies', ensureEmployee, (req, res) => {
  companyManager.getCompanies(function(result) {
    res.json(result);
  });
});

app.get('/api/companies/:companyId', ensureEmployee, (req, res) => {
  companyManager.getCompany(req.params.companyId, function(result) {
    res.json(result);
  });
});

app.delete('/api/companies/:id', ensureEmployee, (req, res) => {
  companyManager.deleteCompany(req.params.id, function(result) {
    res.json(result);
  });
});

app.post('/api/companies', ensureEmployee, (req, res) => {
  companyManager.addCompany(req.body.name, req.body.email, req.body.phone, req.body.municipalId, function(result) {
    res.json(result);
  });
});

app.put('/api/companies/:id', ensureEmployee, function(req, res) {
  getUserId(req, function(userId) {
    companyManager.editCompany(req.body.name, req.body.email, req.body.phone, req.body.municipalId, userId, function(
      result
    ) {
      res.json(result);
    });
  });
});

app.get('/api/companies/municipal/:municipalId', ensureEmployee, (req, res) => {
  companyManager.getLocalCompanies(req.params.municipalId, function(result) {
    res.json(result);
  });
});

app.post('/api/tickets', upload.single('image'), ensureLogin, function(req, res) {
  getUserId(req, function(userId) {
    ticketManager.addTicket(
      req.body.title,
      req.body.description,
      req.body.lat,
      req.body.lon,
      req.body.categoryId,
      req.body.municipalId,
      req.body.subscribed,
      userId,
      function(result) {
        let file = req.file;
        //console.log(file);
        res.json(result);
      }
    );
  });
});

app.put('/api/tickets/:ticketId', ensureLogin, function(req, res) {
  getUserId(req, function(userId) {
    ticketManager.editTicket(
      req.body.title,
      req.body.description,
      req.body.lat,
      req.body.lon,
      req.body.categoryId,
      req.body.municipalId,
      req.body.subscribed,
      userId,
      req.params.ticketId,
      function(result) {
        res.json(result);
      }
    );
  });
});

app.put('/api/tickets/:ticketId/reject', ensureEmployee, function(req, res) {
  ticketManager.setStatus(4, req.params.ticketId, function(result) {
    res.json(result);
  });
});

app.put('/api/tickets/:ticketId/accept', ensureEmployee, function(req, res) {
  ticketManager.makeNews(
    req.params.ticketId,
    req.body.title,
    req.body.description,
    req.body.lat,
    req.body.lon,
    req.body.categoryId,
    req.body.municipalId,

    function(result) {
      res.json(result);
    }
  );
});

app.get('/api/mytickets', ensureLogin, function(req, res) {
  getUserId(req, function(userId) {
    ticketManager.getMyTickets(userId, function(result) {
      res.json(result);
    });
  });
});

app.get('/api/tickets/municipal/:municipalId', ensureEmployee, (req, res) => {
  ticketManager.getLocalTickets(req.params.municipalId, function(result) {
    res.json(result);
  });
});

app.get('/api/categories', ensureLogin, function(req, res) {
  categoryManager.getCategories(function(result) {
    res.json(result);
  });
});

app.get('/api/categories/:parentId', ensureLogin, function(req, res) {
  categoryManager.getSubCategories(req.params.parentId, function(result) {
    res.json(result);
  });
});

app.post('/api/categories', ensureEmployee, (req, res) => {
  categoryManager.addCategory(req.body.name, req.body.parentId, function(result) {
    res.json(result);
  });
});

app.get('/api/municipals', function(req, res) {
  municipalManager.getMunicipals(function(result) {
    res.json(result);
  });
});

app.post('/api/municipals', ensureAdmin, (req, res) => {
  municipalManager.addMunicipal(req.body.name, function(result) {
    res.json(result);
  });
});

app.get('/api/subscriptions', ensureLogin, function(req, res) {
  getUserId(req, function(userId) {
    subscriptionManager.getSubscriptions(userId, function(result) {
      res.json(result);
    });
  });
});

app.post('/api/subscriptions', ensureLogin, function(req, res) {
  getUserId(req, function(userId) {
    subscriptionManager.addSubscription(req.body.newsId, userId, function(result) {
      res.json(result);
    });
  });
});

app.post('/api/subscriptions', ensureAdmin, function(req, res) {
  subscriptionManager.addSubscription(req.body.newsId, req.body.userId, function(result) {
    res.json(result);
  });
});

app.delete('/api/subscriptions/:newsId', ensureLogin, function(req, res) {
  getUserId(req, function(userId) {
    subscriptionManager.deleteSubscription(req.params.newsId, userId, function(result) {
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
  getUserId(req, function(userId) {
    userManager.addMunicipal(userId, req.body.municipalId, function(result) {
      res.json(result);
    });
  });
});

app.delete('/api/mymunicipals/:municipalId', ensureLogin, (req, res) => {
  getUserId(req, function(userId) {
    userManager.deleteMunicipal(userId, req.params.municipalId, function(result) {
      res.json(result);
    });
  });
});

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
console.log('Server started');
