import { Users, UserMunicipals, Municipals } from '../models.js';
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
            message: {
              en: 'Authentication failed. User not found.',
              no: 'Autentisering feilet. Brukeren kunne ikke bli funnet.'
            }
          });
        } else {
          bcrypt.compare(password, user.password, function(err, eq) {
            if (err) throw err;
            if (eq == true) {
              const payload = {
                id: user.id,
                rank: user.rank
              };
              var token = jwt.sign(payload, process.env.CI ? 'TESTKEY' : process.env.JWT, {
                expiresIn: 86400
              });
              callback({
                success: true,
                message: { en: 'Authentication successful.', no: 'Autentisering vellykket.' },
                token: token,
                rank: user.rank,
                municipalId: user.municipalId
              });
            } else {
              callback({
                success: false,
                message: { en: 'Authentication failed. Wrong password.', no: 'Autentisering feilet. Feil passord.' }
              });
            }
          });
        }
      },
      err => callback({ success: false, message: err })
    );
  },

  register: function(name, email, phone, municipalId, rank, callback) {
    const password = generatePassword();
    bcrypt.genSalt(12, function(err, salt) {
      bcrypt.hash(password, salt, null, function(err, hash) {
        if (err) throw er;
        Users.findOne({ where: { $or: { email: email, phone: phone } } }).then(
          user => {
            if (user) {
              callback({
                success: false,
                message: {
                  en: 'Registration failed. Email or phone number already in use.',
                  no: 'Registering feilet. Email eller tlf.nr. er allerede i bruk.'
                }
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
                    message: { en: 'Registration successful.', no: 'Registrering vellykket.' }
                  });
                },
                err => callback({ success: false, message: err })
              );
            }
          },
          err => callback({ success: false, message: err })
        );
      });
    });
  },

  getUsers: function(callback) {
    Users.findAll({
      attributes: ['id', 'name', 'email', 'phone', 'rank', 'municipalId', 'notifications'],
      where: { rank: { $not: 2 } }
    }).then(res => callback({ success: true, data: res }), err => callback({ success: false, message: err }));
  },

  getUser: function(id, callback) {
    Users.findOne({
      where: { id: id },
      attributes: ['id', 'name', 'email', 'phone', 'rank', 'municipalId', 'notifications']
    }).then(res => callback({ success: true, data: res }), err => callback({ success: false, message: err }));
  },

  deleteUser: function(id, callback) {
    Users.destroy({
      where: { id: id, rank: { $not: 2 } }
    }).then(
      res => callback({ success: true, message: { en: 'User deleted.', no: 'Brukeren ble slettet.' } }),
      err => callback({ success: false, message: err })
    );
  },

  editUser: function(name, email, phone, municipalId, userId, notifications, rank, callback) {
    Users.update(
      {
        name: name,
        email: email,
        phone: phone,
        municipalId: municipalId,
        notifications: notifications,
        rank: rank
      },
      { where: { id: userId, rank: { $not: 2 } } }
    ).then(
      res => callback({ success: true, message: { en: 'User updated.', no: 'Brukeren ble oppdatert.' } }),
      err => callback({ success: false, message: err })
    );
  },

  changePass: function(userId, oldPassword, newPassword, callback) {
    Users.findOne({ where: { id: userId } }).then(
      user => {
        if (user == null) {
          callback({ success: false, message: { en: 'User not found.', no: 'Brukeren kunne ikke bli funnet.' } });
        } else {
          bcrypt.compare(oldPassword, user.password, function(err, eq) {
            if (err) throw err;
            if (eq == true) {
              bcrypt.genSalt(12, function(err, salt) {
                bcrypt.hash(newPassword, salt, null, function(err, hash) {
                  if (err) throw er;
                  Users.update(
                    {
                      password: hash
                    },
                    { where: { id: userId } }
                  ).then(
                    res =>
                      callback({
                        success: true,
                        message: { en: 'User and password updated.', no: 'Informasjonen ble oppdatert.' }
                      }),
                    err => callback({ success: false, message: err })
                  );
                });
              });
            } else {
              callback({ success: false, message: { en: 'Wrong password.', no: 'Feil passord.' } });
            }
          });
        }
      },
      err => callback({ success: false, message: err })
    );
  },

  getMunicipals: function(userId, callback) {
    Users.findOne({
      attributes: [],
      include: [
        {
          model: Municipals,
          required: true
        }
      ],
      where: { id: userId }
    }).then(
      res => (res == null ? callback({ success: true, data: [] }) : callback({ success: true, data: res.municipals })),
      err => callback({ success: false, message: err })
    );
  },

  addMunicipal: function(userId, municipalId, callback) {
    UserMunicipals.findOne({ where: { userId: userId, municipalId: municipalId } }).then(
      userMunicipal => {
        if (userMunicipal == null) {
          UserMunicipals.create({
            userId: userId,
            municipalId: municipalId
          }).then(
            res => callback({ success: true, message: { en: 'Municipal added.', no: 'Kommunen ble abbonert på.' } }),
            err => callback({ success: false, message: err })
          );
        } else {
          callback({
            success: false,
            message: { en: 'User already added this municipal.', no: 'Brukeren abonnerer allerede på denne kommunen.' }
          });
        }
      },
      err => callback({ success: false, message: err })
    );
  },

  deleteMunicipal: function(userId, municipalId, callback) {
    UserMunicipals.destroy({
      where: { userId: userId, municipalId: municipalId }
    }).then(
      res =>
        callback({
          success: true,
          message: { en: 'Municipal deleted.', no: 'Kommunen blir ikke lengre abbonert på.' }
        }),
      err => callback({ success: false, message: err })
    );
  }
};

function generatePassword() {
  var pass = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < 12; i++) pass += possible.charAt(Math.floor(Math.random() * possible.length));
  return pass;
}
