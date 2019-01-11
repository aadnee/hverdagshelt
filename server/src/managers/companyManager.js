import { Users } from '../models';
import userManager from './userManager';

module.exports = {
  getCompanies: function(callback) {
    Users.findAll({ attributes: ['id', 'name', 'email', 'phone'], where: { rank: 2 } }).then(
      res => callback({ success: true, data: res }),
      err => callback({ success: false, message: 'Sequelize error' })
    );
  },
  getLocalCompanies: function(municipalId, callback) {
    Users.findAll({
      attributes: ['id', 'name', 'email', 'phone'],
      where: { $and: { municipalId: municipalId, rank: 2 } }
    }).then(
      res => callback({ success: true, data: res }),
      err => callback({ success: false, message: 'Sequelize error' })
    );
  },
  addCompany: function(name, email, phone, municipalId, callback) {
    userManager.register(name, email, phone, municipalId, 2, result => callback(result));
  }
};
