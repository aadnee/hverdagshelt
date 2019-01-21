import { Categories } from '../models';

module.exports = {
  getCategories: function(callback) {
    Categories.findAll({
      include: [{ model: Categories, as: 'subs', where: { active: true }, required: false }],
      where: { active: true, parentId: null }
    }).then(res => callback({ success: true, data: res }), err => callback({ success: false, message: err }));
  },

  addCategory: function(name, parentId, callback) {
    if (parentId == null) {
      createCategory(name, parentId, result => callback(result));
    } else {
      Categories.findOne({ where: { id: parentId, active: true } }).then(cat => {
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
    Categories.update(
      {
        active: false
      },
      { where: { id: categoryId } }
    ).then(
      res =>
        callback({
          success: true,
          message: { en: 'Category deleted.', no: 'Kategori slettet.' }
        }),
      err => callback({ success: false, message: err })
    );
  },

  editCategory: function(categoryId, categoryName, callback) {
    Categories.findOne({ where: { id: categoryId } }).then(category => {
      if (!category) {
        callback({
          success: false,
          message: { en: 'Category not found.', no: 'Fant ikke kategorien.' }
        });
      } else {
        Categories.update(
          {
            name: categoryName
          },
          {
            where: { id: categoryId }
          }
        ).then(
          res =>
            callback({
              success: true,
              message: { en: 'Category updated successfully', no: 'Kategorien ble oppdatert.' }
            }),
          err => callback({ success: false, message: err })
        );
      }
    });
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
