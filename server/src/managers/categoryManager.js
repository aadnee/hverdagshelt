import { Categories } from '../models';

module.exports = {
  getCategories: function(callback) {
    Categories.findAll({ where: { parentId: null } }).then(
      res => callback({ success: true, data: res }),
      err => callback({ success: false, message: err })
    );
  },

  addCategory: function(name, parentId, callback) {
    Categories.findOne({ where: { name: name, parentId: parentId } }).then(cat => {
      if (cat == null) {
        Categories.create({
          name: name,
          parentId: parentId
        }).then(
          result =>
            callback({
              success: true,
              message: { en: 'Category added.', no: 'Kategorien ble lagt til.' },
              id: result.id
            }),
          err => callback({ success: false, message: err })
        );
      } else {
        callback({
          success: false,
          message: { en: 'Category already exists.', no: 'Kategorien eksisterer allerede.' }
        });
      }
    });
  },

  getSubCategories: function(parentId, callback) {
    Categories.findAll({ where: { parentId: parentId } }).then(
      res => callback({ success: true, data: res }),
      err => callback({ success: false, message: err })
    );
  }
};
