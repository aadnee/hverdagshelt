import { Users } from './models.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt-nodejs';
import mailManager from './mailManager';

module.exports = {
  login: function(req, res) {
    Users.findOne({ where: { email: req.body.email } }).then(user => {
      if (!user) {
        res.json({
          success: false,
          message: 'Authentication failed. User not found.'
        });
      } else if (user) {
        console.log(user.password);
        bcrypt.compare(req.body.password, user.password, function(err, eq) {
          if (err) throw err;
          if (eq == true) {
            const payload = {
              id: user.id,
              rank: user.rank
            };
            var token = jwt.sign(payload, 'MY TOKEN HERE EY LMAO', {
              expiresIn: 86400
            });
            res.cookie('token', token);
            res.cookie('rank', user.rank);
            res.json({
              success: true,
              message: 'Authentication successful.'
            });
          } else {
            res.json({
              success: false,
              message: 'Authentication failed. Wrong password.'
            });
          }
        });
      }
    });
  },

  register: function(req, res) {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const phone = req.body.phone;
    const municipalId = req.body.municipalId;
    const password = generatePassword();
    const rank = 1;

    if (
      firstName == null ||
      firstName == '' ||
      lastName == null ||
      lastName == '' ||
      email == null ||
      email == '' ||
      phone == null ||
      phone == '' ||
      municipalId == null ||
      municipalId == ''
    ) {
      res.json({
        success: false,
        message: 'Fields cannot be empty.'
      });
    }

    bcrypt.genSalt(12, function(err, salt) {
      bcrypt.hash(password, salt, null, function(err, hash) {
        if (err) throw er;
        Users.findOne({ where: { $or: [({ email: email }, { phone: phone })] } }).then(user => {
          if (user) {
            res.json({
              success: false,
              message: 'Registration failed. Email or phone number already in use.'
            });
          } else {
            Users.create({
              firstName: firstName,
              lastName: lastName,
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
            res.json({
              success: true,
              message: 'Registration successful.'
            });
          }
        });
      });
    });
  }
};

function generatePassword() {
  var pass = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < 12; i++) pass += possible.charAt(Math.floor(Math.random() * possible.length));
  return pass;
}
