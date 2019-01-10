import { Users } from '../models.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';
import mailManager from './mailManager';

module.exports = {
  login: function(email, password) {
    return new Promise(function(resolve, reject) {
      Users.findOne({ where: { email: email } }).then(user => {
        if (!user) {
          resolve({
            success: false,
            message: 'Authentication failed. User not found.'
          });
        } else if (user) {
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
              resolve({
                success: true,
                message: 'Authentication successful.',
                token: token,
                rank: user.rank
              });
            } else {
              resolve({
                success: false,
                message: 'Authentication failed. Wrong password.'
              });
            }
          });
        }
      });
    });
  },

  register: function(name, email, phone, municipalId, rank) {
    return new Promise(function(resolve, reject) {
      const password = generatePassword();

      if (
        name == null ||
        name == '' ||
        email == null ||
        email == '' ||
        phone == null ||
        phone == '' ||
        municipalId == null ||
        municipalId == ''
      ) {
        resolve({
          success: false,
          message: 'Fields cannot be empty.'
        });
      }

      bcrypt.genSalt(12, function(err, salt) {
        bcrypt.hash(password, salt, null, function(err, hash) {
          if (err) throw er;
          Users.findOne({ where: { $or: [({ email: email }, { phone: phone })] } }).then(user => {
            if (user) {
              resolve({
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
              });
              mailManager.send(
                'Hverdagshelt registrering',
                '<h1>Velkommen til Hverdagshelt!</h1><h3>Ditt passord er: <b>' + password + '</b></h3>',
                email
              );
              resolve({
                success: true,
                message: 'Registration successful.'
              });
            }
          });
        });
      });
    });
  },

  getUsers: function() {
    return Users.findAll({
      attributes: ['id', 'name', 'email', 'phone', 'rank', 'municipalId'],
      where: { rank: { $not: 2 } }
    });
  },

  getUser: function(id) {
    return Users.findOne({
      where: { $and: { id: Number(id), rank: { $not: 2 } } },
      attributes: ['id', 'name', 'email', 'phone', 'rank', 'municipalId']
    });
  }
};

function generatePassword() {
  var pass = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < 12; i++) pass += possible.charAt(Math.floor(Math.random() * possible.length));
  return pass;
}
