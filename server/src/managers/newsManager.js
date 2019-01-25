import { News, Users, Uploads, Categories } from '../models.js';
import mailManager from './mailManager';

module.exports = {
  addArticle: function(title, description, categoryId, lat, lon, address, municipalId, callback) {
    News.create({
      title: title,
      description: description,
      categoryId: categoryId,
      status: 2,
      lat: lat,
      lon: lon,
      address: address,
      municipalId: municipalId
    }).then(
      result =>
        callback({
          success: true,
          message: { en: 'Article added.', no: 'Artikkelen ble lagt til.' },
          id: result.id
        }),
      err => callback({ success: false, message: err })
    );
  },

  finishNews: function(id, callback) {
    News.findOne({ where: { id: id } }).then(
      article => {
        if (article == null) {
          callback({
            success: false,
            message: { en: 'Article not found.', no: 'Artikkelen kunne ikke bli funnet.' }
          });
        } else {
          News.update(
            {
              status: 3
            },
            {
              where: { id: id }
            }
          ).then(
            res => {
              // Send mail alerting subscribers
              News.findOne({
                attributes: ['title'],
                include: [{ model: Users, attributes: ['email', 'notifications'], required: true }],
                where: { id: id }
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
                            user.email
                          )
                        : null;
                    });
                  }
                  callback({
                    success: true,
                    message: { en: 'Article updated successfully', no: 'Artikkelen ble oppdatert.' }
                  });
                },
                err => callback({ success: false, message: err })
              );
            },
            err => callback({ success: false, message: err })
          );
        }
      },
      err => callback({ success: false, message: err })
    );
  },

  assignCompany: function(id, companyId, callback) {
    News.findOne({ where: { id: id } }).then(
      article => {
        if (article == null) {
          callback({
            success: false,
            message: { en: 'Article not found.', no: 'Artikkelen kunne ikke bli funnet.' }
          });
        } else {
          News.update(
            {
              companyId: companyId,
              feedback: null,
              companyStatus: 1
            },
            {
              where: { id: id }
            }
          ).then(
            res => {
              callback({
                success: true,
                message: { en: 'Article updated successfully', no: 'Artikkelen ble oppdatert.' }
              });
            },
            err => callback({ success: false, message: err })
          );
        }
      },
      err => callback({ success: false, message: err })
    );
  },

  updateNews: function(id, title, description, categoryId, callback) {
    News.findOne({ where: { id: id } }).then(
      article => {
        if (article == null) {
          callback({
            success: false,
            message: { en: 'Article not found.', no: 'Artikkelen kunne ikke bli funnet.' }
          });
        } else {
          News.update(
            {
              title: title,
              description: description,
              categoryId: categoryId
            },
            {
              where: { id: id }
            }
          ).then(
            res => {
              callback({
                success: true,
                message: { en: 'Article updated successfully', no: 'Artikkelen ble oppdatert.' }
              });
            },
            err => callback({ success: false, message: err })
          );
        }
      },
      err => callback({ success: false, message: err })
    );
  },

  getNews: function(callback) {
    var sevenDays = new Date(Date.now() - 60 * 60 * 24 * 7 * 1000);
    News.findAll({
      where: { $or: [{ status: 2 }, { status: 3, updatedAt: { $gte: sevenDays } }] },
      include: [{ model: Uploads }],
      order: [['id', 'DESC']]
    }).then(res => callback({ success: true, data: res }), err => callback({ success: false, message: err }));
  },

  getArticle: function(newsId, callback) {
    News.findOne({ where: { id: newsId }, include: [{ model: Uploads }] }).then(
      res => callback({ success: true, data: res }),
      err => callback({ success: false, message: err })
    );
  },

  getFilteredNews: function(municipalIds, categoryIds, page, limit, callback) {
    let whereStataments = categoryIds.length == 0 ? {} : { parentId: categoryIds };
    News.findAll({
      include: [{ model: Uploads }, { attributes: [], model: Categories, where: whereStataments }],
      where: { municipalId: municipalIds, status: 2 },
      offset: page == 0 ? null : (page - 1) * limit,
      limit: limit == 0 ? null : limit,
      order: [['updatedAt', 'DESC']]
    }).then(res => callback({ success: true, data: res }), err => callback({ success: false, message: err }));
  },

  getArchivedNews: function(municipalIds, categoryIds, page, limit, callback) {
    let whereStataments = categoryIds.length == 0 ? {} : { parentId: categoryIds };
    News.findAll({
      include: [{ model: Uploads }, { attributes: [], model: Categories, where: whereStataments }],
      where: { municipalId: municipalIds, status: 3 },
      offset: page == 0 ? null : (page - 1) * limit,
      limit: limit == 0 ? null : limit,
      order: [['updatedAt', 'DESC']]
    }).then(res => callback({ success: true, data: res }), err => callback({ success: false, message: err }));
  }
};
