import { Users } from '../models';
import userManager from './userManager';

module.exports = {
  getCompanies: function(callback) {
    Users.findAll({ attributes: ['id', 'name', 'email', 'phone', 'municipalId'], where: { rank: 2 } }).then(
      res => callback({ success: true, data: res }),
      err => callback({ success: false, message: err })
    );
  },

  getLocalCompanies: function(municipalId, callback) {
    Users.findAll({
      attributes: ['id', 'name', 'email', 'phone', 'municipalId'],
      where: { municipalId: municipalId, rank: 2 }
    }).then(res => callback({ success: true, data: res }), err => callback({ success: false, message: err }));
  },

  addCompany: function(name, email, phone, municipalId, callback) {
    userManager.register(name, email, phone, municipalId, 2, result => callback(result));
  },

  getCompany: function(id, callback) {
    Users.findOne({
      where: { id: id, rank: 2 },
      attributes: ['id', 'name', 'email', 'phone', 'municipalId']
    }).then(res => callback({ success: true, data: res }), err => callback({ success: false, message: err }));
  },

  deleteCompany: function(id, callback) {
    Users.destroy({
      where: { id: id, rank: 2 }
    }).then(
      res => callback({ success: true, message: 'Company deleted.' }),
      err => callback({ success: false, message: err })
    );
  },

  editCompany: function(name, email, phone, municipalId, userId, callback) {
    Users.update(
      {
        name: name,
        email: email,
        phone: phone,
        municipalId: municipalId
      },
      { where: { id: userId, rank: 2 } }
    ).then(
      res => callback({ success: true, message: 'Company updated.' }),
      err => callback({ success: false, message: err })
    );
  }
};
