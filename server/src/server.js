import express from 'express';
import path from 'path';
import reload from 'reload';
import fs from 'fs';
import { Users } from './models.js';

const public_path = path.join(__dirname, '/../../client/public');

let app = express();

app.use(express.static(public_path));
app.use(express.json());

app.get('/users', (req, res) => {
  return Users.findAll().then(users => res.send(users));
});

app.get('/users/:id', (req, res) => {
  return Users.findOne({ where: { id: Number(req.params.id) } }).then(
    user => (user ? res.send(user) : res.sendStatus(404))
  );
});

app.put('/users', (req, res) => {
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
