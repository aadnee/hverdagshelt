import express from 'express';
import path from 'path';
import reload from 'reload';
import fs from 'fs';
import { Users } from './models.js';
import userManager from './manager/userManager';
import newsManager from './manager/newsManager';
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
  return newsManager.getLocalNews(req,res);
});

app.put('/api/news/:id', function(req, res) {
  return newsManager.updateNews(req, res);
});

app.post('/api/news', function(req, res) {
  return newsManager.addArticle(req, res);
});

// email, password
app.post('/api/login', function(req, res) {
  return userManager.login(req, res);
});

// firstName, lastName, email, phone, municipalId
app.post('/api/register', function(req, res) {
  return userManager.register(req, res);
});

app.get('/api/users', ensureAdmin, (req, res) => {
  return userManager.getUsers(req, res);
});

// id
app.get('/api/users/:id', ensureAdmin, (req, res) => {
  return userManager.getUser(req, res);
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
