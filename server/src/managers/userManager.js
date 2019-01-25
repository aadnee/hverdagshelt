import { Users, UserMunicipals, Municipals } from '../models.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';
import mailManager from './mailManager';
import moment from 'moment';

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
    const password = generatePassword(12);
    let userManager = this;
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
                    email,
                    function(result) {
                      if (result) {
                        userManager.addMunicipal(res.id, municipalId, () => {
                          callback({
                            success: true,
                            message: { en: 'Registration successful.', no: 'Registrering vellykket.' }
                          });
                        });
                      } else {
                        callback({ success: false, message: { en: 'Email error.', no: 'Email error.' } });
                      }
                    }
                  );
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
        rank: rank,
        reset: null
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

  sendReset: function(email, callback) {
    Users.findOne({ where: { email: email } }).then(
      res => {
        if (res == null) {
          callback({
            success: false,
            message: {
              en: 'User does not exist.',
              no: 'Brukeren eksisterer ikke.'
            }
          });
        } else {
          let key = generatePassword(5);
          Users.update({ reset: key }, { where: { email: email } }).then(
            res => {
              mailManager.send(
                'Hverdagshelt: Tilbakestilling av passord',
                '<h3>Ignorer denne meldingen dersom du ikke har etterspurt tilbakestilling passord.</h3>' +
                  '<p>Din tilbakestillings kode er følgende:</p>' +
                  '<b>' +
                  key +
                  '</b>',
                email,
                function(result) {
                  if (result) {
                    callback({ success: true, message: { en: 'Email sent.', no: 'En epost har blitt sent.' } });
                  } else {
                    callback({ success: false, message: { en: 'Mail error.', no: 'Mail error.' } });
                  }
                }
              );
            },
            err => callback({ success: false, message: err })
          );
        }
      },
      err => callback({ success: false, message: err })
    );
  },

  resetPassword: function(email, key, callback) {
    var tenMinutes = new Date(Date.now() - 1000 * 60 * 10);
    Users.findOne({ where: { email: email, reset: key, updatedAt: { $gte: tenMinutes } } }).then(
      res => {
        if (res == null) {
          callback({ success: false, message: { en: 'Wrong email/key.', no: 'Feil epost eller kode.' } });
        } else {
          let password = generatePassword(12);
          bcrypt.genSalt(12, function(err, salt) {
            bcrypt.hash(password, salt, null, function(err, hash) {
              Users.update(
                {
                  password: hash,
                  reset: null
                },
                { where: { email: email } }
              ).then(
                res => {
                  mailManager.send(
                    'Hverdagshelt: Nytt passord',
                    '<h3>Ditt nye passord er som følger:</h3>' + '<b>' + password + '</b>',
                    email,
                    function(result) {
                      if (result) {
                        callback({
                          success: true,
                          message: { en: 'Email with new password sent.', no: 'Nytt passord er sent på epost.' }
                        });
                      } else {
                        callback({ success: false, message: { en: 'Mail error.', no: 'Mail error.' } });
                      }
                    }
                  );
                },
                err => callback({ success: false, message: err })
              );
            });
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
          message: { en: 'Municipal deleted.', no: 'Kommunen blir ikke lengre abonnert på.' }
        }),
      err => callback({ success: false, message: err })
    );
  },

  //statistics
  userIncrease: function(municipalId, year, month, week, callback) {
    let start;
    let end;
    if (municipalId == null || year == null) {
      callback({ success: false, message: 'MunicipalId and year is required' });
    } else {
      if (week == null && month == null && year != null) {
        start = moment(year + '-01-01');
        end = moment(year + '-12-31');
      } else if (week == null && month != null && year != null) {
        start = moment(year + '-' + month + '-01');
        end = moment(year + '-' + month + '-01').endOf('month');
      } else if (week != null && year != null) {
        start = moment(year + '-01-01')
          .day('Monday')
          .week(week);

        week += 1;
        end = moment(year + '-01-01')
          .day('Monday')
          .week(week);
      }
    }
    let startInt;
    Users.count({
      where: { createdAt: { $lte: start }, municipalId: municipalId }
    }).then(res => {
      startInt = parseInt(res);
    });
    Users.count({
      where: { createdAt: { $lte: end }, municipalId: municipalId }
    }).then(
      res => {
        let endInt = parseInt(res);
        let increase = endInt - startInt;
        let percentage = null;
        if (startInt != 0) {
          percentage = parseFloat(Math.round(increase / startInt) * 100).toFixed(2);
        }
        callback({ success: true, start: startInt, end: endInt, increase: increase, percentageIncrease: percentage });
      },
      err => callback({ success: false, message: err })
    );
  }
};

function generatePassword(length) {
  var pass = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < length; i++) pass += possible.charAt(Math.floor(Math.random() * possible.length));
  return pass;
}
