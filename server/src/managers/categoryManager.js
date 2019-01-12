import { Categories } from '../models';

module.exports = {
  getCategories: function(callback) {
    Categories.findAll().then(
      res => callback({ success: true, data: res }),
      err => callback({ success: false, message: 'Sequelize error' })
    );
  },

  addCategory: function(name, parentId, callback) {
    Categories.create({
      name: name,
      parentId: parentId
    }).then(
      result =>
        callback({
          success: true,
          message: 'Category added.',
          id: result.id
        }),
      err => callback({ success: false, message: 'Sequelize error' })
    );
  }
};
