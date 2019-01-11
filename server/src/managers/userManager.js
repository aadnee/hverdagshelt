import { Users } from '../models.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';
import mailManager from './mailManager';

module.exports = {
  login: function(email, password, callback) {
    Users.findOne({ where: { email: email } }).then(
      user => {
        if (!user) {
          callback({
            success: false,
            message: 'Authentication failed. User not found.'
          });
        } else {
          bcrypt.compare(password, user.password, function(err, eq) {
            if (err) throw err;
            if (eq == true) {
              const payload = {
                id: user.id,
                rank: user.rank,
                municipalId: user.municipalId
              };
              var token = jwt.sign(payload, process.env.JWT, {
                expiresIn: 86400
              });
              callback({
                success: true,
                message: 'Authentication successful.',
                token: token,
                rank: user.rank
              });
            } else {
              callback({
                success: false,
                message: 'Authentication failed. Wrong password.'
              });
            }
          });
        }
      },
      err => callback({ success: false, message: 'Sequelize error' })
    );
  },

  register: function(name, email, phone, municipalId, rank, callback) {
    const password = generatePassword();
    bcrypt.genSalt(12, function(err, salt) {
      bcrypt.hash(password, salt, null, function(err, hash) {
        if (err) throw er;
        Users.findOne({ where: { $or: [({ email: email }, { phone: phone })] } }).then(
          user => {
            if (user) {
              callback({
                success: false,
                message: 'Registration failed. Email or phone number already in use.'
              });
            } else {
              Users.create({
                name: name,
                email: email,
                phone: phone,
                password: hash,
                rank: rank,
                municipalId: municipalId
              }).then(
                res => {
                  mailManager.send(
                    'Hverdagshelt registrering',
                    '<h1>' +
                      name +
                      ',</h1><h2>Velkommen til Hverdagshelt!</h2><h3>Ditt passord er: <b>' +
                      password +
                      '</b></h3>',
                    email
                  );
                  callback({
                    success: true,
                    message: 'Registration successful.'
                  });
                },
                err => callback({ success: false, message: 'Sequelize error' })
              );
            }
          },
          err => callback({ success: false, message: 'Sequelize error' })
        );
      });
    });
  },

  getUsers: function(callback) {
    Users.findAll({
      attributes: ['id', 'name', 'email', 'phone', 'rank', 'municipalId'],
      where: { rank: { $not: 2 } }
    }).then(
      res => callback({ success: true, data: res }),
      err => callback({ success: false, message: 'Sequelize error' })
    );
  },

  getUser: function(id, callback) {
    Users.findOne({
      where: { $and: { id: id, rank: { $not: 2 } } },
      attributes: ['id', 'name', 'email', 'phone', 'rank', 'municipalId']
    }).then(
      res => callback({ success: true, data: res }),
      err => callback({ success: false, message: 'Sequelize error' })
    );
  },

  deleteUser: function(id, callback) {
    Users.destroy({
      where: { id: id }
    }).then(
      res => callback({ success: true, message: 'User deleted.' }),
      err => callback({ success: false, message: 'Sequelize error' })
    );
  }
};

function generatePassword() {
  var pass = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < 12; i++) pass += possible.charAt(Math.floor(Math.random() * possible.length));
  return pass;
}
