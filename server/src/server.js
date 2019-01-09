import express from 'express';
import path from 'path';
import reload from 'reload';
import fs from 'fs';
import { Users } from './models.js';
import userManager from './managers/userManager';
import newsManager from './managers/newsManager';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

const public_path = path.join(__dirname, '/../../client/public');

let app = express();

app.use(express.static(public_path));
app.use(express.json());
app.use(cookieParser());
dotenv.config();

app.get('/api/news', function(req, res) {
  newsManager.getLocalNews(req.cookies['token']).then(result => res.json(result));
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
    .register(req.body.firstName, req.body.lastName, req.body.email, req.body.phone, req.body.municipalId)
    .then(result => res.json(result));
});

app.get('/api/users', ensureAdmin, (req, res) => {
  userManager.getUsers().then(result => res.json(result));
});

// id
app.get('/api/users/:id', ensureAdmin, (req, res) => {
  userManager.getUser(req.params.id).then(result => res.json(result));
});

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
