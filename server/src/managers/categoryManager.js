import { Categories } from '../models';

module.exports = {
  getCategories: function(callback) {
    Categories.findAll({ where: { parentId: null } }).then(
      res => callback({ success: true, data: res }),
      err => callback({ success: false, message: err })
    );
  },

  addCategory: function(name, parentId, callback) {
    if (parentId == null) {
      createCategory(name, parentId, result => callback(result));
    } else {
      Categories.findOne({ where: { id: parentId } }).then(cat => {
        if (cat != null && cat.parentId != null) {
          callback({
            success: false,
            message: {
              en: 'Cannot add a sub category to another sub category.',
              no: 'Kan ikke legge til en underkategori til en annen underkategori.'
            }
          });
        } else if (cat == null) {
          callback({
            success: false,
            message: { en: 'Parent category does not exist.', no: 'Hovedkategorien finnes ikke.' }
          });
        } else {
          createCategory(name, parentId, result => callback(result));
        }
      });
    }
  },

  deleteCategory: function(categoryId, callback) {
    Categories.findOne({ where: { parentId: categoryId } }).then(cat => {
      if (cat != null) {
        callback({
          success: false,
          message: {
            en: 'Cannot delete a category with subcategories.',
            no: 'Kan ikke slette en kategori med underkategorier.'
          }
        });
      } else {
        Categories.destroy({ where: { id: categoryId } }).then(
          res =>
            callback({
              success: true,
              message: { en: 'Category deleted.', no: 'Kategori slettet.' }
            }),
          err => callback({ success: false, message: err })
        );
      }
    });
  },

  editCategory: function(id, callback) {},

  getSubCategories: function(parentId, callback) {
    Categories.findAll({ where: { parentId: parentId } }).then(
      res => callback({ success: true, data: res }),
      err => callback({ success: false, message: err })
    );
  }
};

function createCategory(name, parentId, callback) {
  Categories.create({
    name: name,
    parentId: parentId
  }).then(
    res =>
      callback({
        success: true,
        message: { en: 'Category added.', no: 'Kategorien ble lagt til.' },
        id: res.id
      }),
    err => callback({ success: false, message: err })
  );
}
