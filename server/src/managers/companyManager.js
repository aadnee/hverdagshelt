import { Users, News, Uploads } from '../models';
import userManager from './userManager';

module.exports = {
  getCompanies: function(callback) {
    Users.findAll({
      attributes: ['id', 'name', 'email', 'phone', 'municipalId', 'notifications'],
      where: { rank: 2 }
    }).then(res => callback({ success: true, data: res }), err => callback({ success: false, message: err }));
  },

  getLocalCompanies: function(municipalId, callback) {
    Users.findAll({
      attributes: ['id', 'name', 'email', 'phone', 'municipalId', 'notifications'],
      where: { municipalId: municipalId, rank: 2 }
    }).then(res => callback({ success: true, data: res }), err => callback({ success: false, message: err }));
  },

  addCompany: function(name, email, phone, municipalId, callback) {
    userManager.register(name, email, phone, municipalId, 2, result => callback(result));
  },

  getCompany: function(id, callback) {
    Users.findOne({
      where: { id: id, rank: 2 },
      attributes: ['id', 'name', 'email', 'phone', 'municipalId', 'notifications']
    }).then(res => callback({ success: true, data: res }), err => callback({ success: false, message: err }));
  },

  deleteCompany: function(id, callback) {
    Users.destroy({
      where: { id: id, rank: 2 }
    }).then(
      res => callback({ success: true, message: { en: 'Company deleted.', no: 'Firmaet ble slettet.' } }),
      err => callback({ success: false, message: err })
    );
  },

  editCompany: function(name, email, phone, municipalId, notifications, userId, callback) {
    Users.update(
      {
        name: name,
        email: email,
        phone: phone,
        municipalId: municipalId,
        notifications: notifications
      },
      { where: { id: userId, rank: 2 } }
    ).then(
      res => callback({ success: true, message: { en: 'Company updated.', no: 'Firmaet ble oppdatert.' } }),
      err => callback({ success: false, message: err })
    );
  },

  getTasks: function(companyId, callback) {
    News.findAll({ include: [{ model: Uploads }], where: { companyId: companyId } }).then(
      res => callback({ success: true, res: res }),
      err => callback({ success: false, message: err })
    );
  },

  acceptTask: function(companyId, newsId, callback) {
    News.update({ companyStatus: 2 }, { where: { id: newsId, companyId: companyId } }).then(
      res => callback({ success: true, message: { en: 'Task accepted.', no: 'Oppdraget ble godtatt.' } }),
      err => callback({ success: false, message: err })
    );
  },

  rejectTask: function(companyId, newsId, callback) {
    News.update({ companyStatus: 4, companyId: null }, { where: { id: newsId, companyId: companyId } }).then(
      res => callback({ success: true, message: { en: 'Task rejected.', no: 'Oppdraget ble avslått.' } }),
      err => callback({ success: false, message: err })
    );
  },

  finishTask: function(companyId, newsId, callback) {
    News.update({ status: 3, companyStatus: 3 }, { where: { id: newsId, companyId: companyId } }).then(
      res => callback({ success: true, message: { en: 'Task finished.', no: 'Oppdraget ble markert som ferdig.' } }),
      err => callback({ success: false, message: err })
    );
  }
};
