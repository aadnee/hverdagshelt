import { Users, News, Uploads } from '../models';
import userManager from './userManager';
import mailManager from './mailManager';

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
      res => {
        News.findOne({
          attributes: ['title'],
          include: [{ model: Users, attributes: ['email', 'notifications'], required: true }],
          where: { id: newsId }
        }).then(
          res => {
            if (res != null) {
              let title = res.title;
              res.users.map(user => {
                user.notifications
                  ? mailManager.send(
                      'En nyhet du følger er fullført',
                      '<h3>"' +
                        title +
                        '" ble markert som fullført.</h3><h4>Sjekk Hverdagshelt nettsiden for mer informasjon.</h4>',
                      user.email,
                      function() {}
                    )
                  : null;
                callback({
                  success: true,
                  message: { en: 'Task finished.', no: 'Oppdraget ble markert som ferdig.' }
                });
              });
            } else {
              callback({ success: true, message: { en: 'Task finished.', no: 'Oppdraget ble markert som ferdig.' } });
            }
          },
          err => callback({ success: false, message: err })
        );
      },
      err => callback({ success: false, message: err })
    );
  },

  checkTimeLimits: function(callback) {
    var days = new Date(Date.now() - 60 * 60 * 24 * 7 * 1000);
    News.findAll({ where: { companyStatus: 1, updatedAt: { $lte: days } } }).then(
      res => {
        if (res.length > 0) {
          res.map((article, i) => {
            News.update({ companyId: null, companyStatus: 4 }, { where: { id: article.id } }).then(
              res =>
                i == res.length - 1
                  ? callback({
                      success: true,
                      message: {
                        en: res.length + ' task(s) returned.',
                        no: res.length + ' oppdrag har utgått og ble sendt tilbake.'
                      }
                    })
                  : null,
              err => callback({ success: false, message: err })
            );
          });
        } else {
          callback({ success: true, message: { en: 'No expired tasks.', no: 'Ingen utgåtte oppdrag.' } });
        }
      },
      err => callback({ success: false, message: err })
    );
  }
};
