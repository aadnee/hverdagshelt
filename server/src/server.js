import express from 'express';
import path from 'path';
import reload from 'reload';
import fs from 'fs';
import { Users } from './models.js';
import feed from './feed';
import userManager from './userManager';
import cookieParser from 'cookie-parser';

const public_path = path.join(__dirname, '/../../client/public');

let app = express();

app.use(express.static(public_path));
app.use(express.json());
app.use(cookieParser());

app.get('/api/feed', function(req, res) {
  return feed.getFeed();
});

// email, password
app.post('/api/login', function(req, res) {
  return userManager.login(req, res);
});

// firstName, lastName, email, phone, municipalId
app.post('/api/register', function(req, res) {
  return userManager.register(req, res);
});

app.get('/api/users', (req, res) => {
  return Users.findAll().then(users => res.send(users));
});

app.get('/api/users/:id', (req, res) => {
  return Users.findOne({ where: { id: Number(req.params.id) } }).then(
    user => (user ? res.send(user) : res.sendStatus(404))
  );
});

app.put('/api/users', (req, res) => {
  if (
    !req.body ||
    typeof req.body.id != 'number' ||
    typeof req.body.firstName != 'string' ||
    typeof req.body.lastName != 'string' ||
    typeof req.body.email != 'string' ||
    typeof req.body.password != 'string' ||
    typeof req.body.rank != 'number' ||
    typeof req.body.companyId != 'number' ||
    typeof req.body.municipalId != 'number'
  )
    return res.sendStatus(400);

  return Users.update(
    {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      rank: req.body.rank
    },
    { where: { id: req.body.id } }
  ).then(count => (count ? res.sendStatus(200) : res.sendStatus(404)));
});

function ensureLogin(req, res, next) {
  jwt.verify(req.cookies['token'], 'MY TOKEN HERE EY LMAO', function(err, decoded) {
    if (decoded && decoded.id) {
      next();
    } else {
      res.clearCookie('token');
      res.clearCookie('rank');
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
