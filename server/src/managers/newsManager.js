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
    })
      .then(result =>
        callback({
          success: true,
          message: 'Article added.',
          id: result.id
        })
      )
      .catch(function(err) {
        callback({ success: false, message: 'Sequelize error' });
      });
  },

  updateNews: function(id, title, description, status, categoryId, companyId, callback) {
    News.findOne({ where: { id: id } })
      .then(article => {
        if (!article) {
          callback({
            success: false,
            message: 'Article not found.'
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
          )
            .then(() =>
              callback({
                success: true,
                message: 'Article updated successfully'
              })
            )
            .catch(function(err) {
              callback({ success: false, message: 'Sequelize error' });
            });
        }
      })
      .catch(function(err) {
        callback({ success: false, message: 'Sequelize error' });
      });
  },

  getLocalNews: function(municipalId, callback) {
    News.findAll({ where: { municipalId: municipalId } })
      .then(res => callback({ success: true, data: res }))
      .catch(function(err) {
        callback({ success: false, message: 'Sequelize error' });
      });
  }
};
