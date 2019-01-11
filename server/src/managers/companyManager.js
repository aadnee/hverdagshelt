import { Users } from '../models';

module.exports = {
  getCompanies: function(callback) {
    Users.findAll({ attributes: ['id', 'name', 'email', 'phone'], where: { rank: 2 } })
      .then(res => callback({ success: true, data: res }))
      .catch(function(err) {
        callback({ success: false, message: 'Sequelize error' });
      });
  },
  getLocalCompanies: function(municipalId, callback) {
    Users.findAll({
      attributes: ['id', 'name', 'email', 'phone'],
      where: { $and: { municipalId: municipalId, rank: 2 } }
    })
      .then(res => callback({ success: true, data: res }))
      .catch(function(err) {
        callback({ success: false, message: 'Sequelize error' });
      });
  }
};
