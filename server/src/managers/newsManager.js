import { News } from '../models.js';
import jwt from 'jsonwebtoken';

module.exports = {
  addArticle: function(title, description, categoryId, lat, lon, municipalId, callback) {
    News.create({
      title: title,
      description: description,
      categoryId: categoryId,
      status: 1,
      lat: lat,
      lon: lon,
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

  updateNews: function(id, title, description, status, categoryId, companyId, callback) {
    News.findOne({ where: { id: id } }).then(
      article => {
        if (!article) {
          callback({
            success: false,
            message: { en: 'Article not found.', no: 'Artikkelen kunne ikke bli funnet.' }
          });
        } else {
          News.update(
            {
              title: title,
              description: description,
              status: status,
              categoryId: categoryId,
              companyId: companyId
            },
            {
              where: { id: id }
            }
          ).then(
            res =>
              callback({
                success: true,
                message: { en: 'Article updated successfully', no: 'Artikkelen ble oppdatert.' }
              }),
            err => callback({ success: false, message: err })
          );
        }
      },
      err => callback({ success: false, message: err })
    );
  },

  getFilteredNews: function(municipalIds, categoryIds, callback) {
    News.findAll({ where: { municipalId: municipalIds, categoryId: categoryIds } }).then(
      res => callback({ success: true, data: res }),
      err => callback({ success: false, message: err })
    );
  }
};
