import express from 'express';
import path from 'path';
import reload from 'reload';
import fs from 'fs';
import { Users } from './models.js';
import userManager from './managers/userManager';
import newsManager from './managers/newsManager';
import ticketManager from './managers/ticketManager';
import companyManager from './managers/companyManager';
import cookieParser from 'cookie-parser';

import jwt from 'jsonwebtoken';

const public_path = path.join(__dirname, '/../../client/public');

let app = express();

app.use(express.static(public_path));
app.use(express.json());
app.use(cookieParser());

// municipalId
app.get('/api/news/municipal/:municipalId', function(req, res) {
  newsManager.getLocalNews(req.params.municipalId).then(result => res.json(result));
});

app.put('/api/news/:id', function(req, res) {
  newsManager
    .updateNews(
      req.params.id,
      req.body.title,
      req.body.description,
      req.body.status,
      req.body.categoryId,
      req.body.companyId
    )
    .then(result => res.json(result));
});

app.post('/api/news', function(req, res) {
  newsManager
    .addArticle(
      req.body.title,
      req.body.description,
      req.body.status,
      req.body.categoryId,
      req.body.lat,
      req.body.lon,
      req.body.municipalId
    )
    .then(result => res.json(result));
});

// email, password
app.post('/api/login', function(req, res) {
  userManager.login(req.body.email, req.body.password).then(result => {
    res.cookie('token', result.token);
    res.cookie('rank', result.rank);
    res.json(result);
  });
});

// firstName, lastName, email, phone, municipalId
app.post('/api/register', function(req, res) {
  userManager
    .register(req.body.name, req.body.email, req.body.phone, req.body.municipalId, 1)
    .then(result => res.json(result));
});

app.get('/api/users', ensureAdmin, (req, res) => {
  userManager.getUsers().then(result => res.json(result));
});

// id
app.get('/api/users/:id', ensureAdmin, (req, res) => {
  userManager.getUser(req.params.id).then(result => res.json(result));
});

app.get('/api/companies', ensureEmployee, (req, res) => {
  companyManager.getCompanies().then(result => res.json(result));
});

// municipalId
app.get('/api/companies/municipal/:municipalId', ensureEmployee, (req, res) => {
  companyManager.getLocalCompanies(req.params.municipalId).then(result => res.json(result));
});

app.post('/api/companies', function(req, res) {
  userManager
    .register(req.body.name, req.body.email, req.body.phone, req.body.municipalId, 2)
    .then(result => res.json(result));
});

app.post('/api/tickets', ensureLogin, function(req, res) {
  getUserId(req, function(userId) {
    ticketManager
      .addTicket(
        req.body.title,
        req.body.description,
        req.body.lat,
        req.body.lon,
        req.body.categoryId,
        req.body.municipalId,
        userId
      )
      .then(result => res.json(result));
  });
});

function getUserId(req, callback) {
  jwt.verify(req.cookies['token'], process.env.JWT, function(err, decoded) {
    if (decoded && decoded.id) {
      callback(decoded.id);
    } else {
      callback(false);
    }
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
    if (decoded && decoded.rank && decoded.rank >= 2) {
      next();
    } else {
      res.sendStatus(403);
    }
  });
}

function ensureAdmin(req, res, next) {
  jwt.verify(req.cookies['token'], process.env.JWT, function(err, decoded) {
    if (decoded && decoded.rank && decoded.rank >= 3) {
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

// The listen promise can be used to wait for the web server to start (for instance in your tests)
export let listen = new Promise((resolve, reject) => {
  app.listen(3000, error => {
    if (error) reject(error.message);
    console.log('Server started');
    resolve();
  });
});
