import { Users } from '../models';
import mailManager from './mailManager';
import bcrypt from 'bcrypt-nodejs';

module.exports = {
  getCompanies: function() {
    return Users.findAll({ attributes: ['id', 'name', 'email', 'phone'], where: { rank: 2 } });
  },
  getLocalCompanies: function(municipalId) {
    return Users.findAll({
      attributes: ['id', 'name', 'email', 'phone'],
      where: { $and: { municipalId: municipalId, rank: 2 } }
    });
  }
};
