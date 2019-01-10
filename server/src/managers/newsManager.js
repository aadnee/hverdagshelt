import { News } from '../models.js';
import jwt from 'jsonwebtoken';

module.exports = {
  addArticle: function(title, description, status, categoryId, lat, lon, municipalId) {
    return new Promise(function(resolve, reject) {
      if (
        title == null ||
        title == '' ||
        description == null ||
        description == '' ||
        status == null ||
        status == '' ||
        categoryId == null ||
        categoryId == '' ||
        lat == null ||
        lat == '' ||
        lon == null ||
        lon == '' ||
        municipalId == null ||
        municipalId == ''
      ) {
        resolve({
          success: false,
          message: 'Fields cannot be empty.'
        });
      } else {
        News.create({
          title: title,
          description: description,
          status: status,
          categoryId: categoryId,
          lat: lat,
          lon: lon,
          municipalId: municipalId
        }).then(result =>
          resolve({
            success: true,
            message: 'Article added.',
            id: result.id
          })
        );
      }
    });
  },

  updateNews: function(id, title, description, status, categoryId, companyId) {
    return new Promise(function(resolve, reject) {
      News.findOne({ where: { id: id } }).then(article => {
        if (
          !article ||
          title == null ||
          title == '' ||
          description == null ||
          description == '' ||
          status == null ||
          status == '' ||
          categoryId == null ||
          categoryId == ''
        ) {
          resolve({
            success: false,
            message: 'Article not found.'
          });
        } else if (article) {
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
          );
          resolve({
            success: true,
            message: 'Article updated successfully'
          });
        }
      });
    });
  },

  getLocalNews: function(token) {
    return new Promise(function(resolve, reject) {
      jwt.verify(token, process.env.JWT, function(err, decoded) {
        if (decoded && decoded.municipalId) {
          News.findAll({ where: { municipalId: decoded.municipalId } }).then(news => resolve(news));
        } else {
          resolve({
            success: false,
            message: 'Not found.'
          });
        }
      });
    });
  }
};
