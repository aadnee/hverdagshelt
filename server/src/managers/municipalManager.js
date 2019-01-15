import { Municipals } from '../models';

module.exports = {
  getMunicipals: function(callback) {
    Municipals.findAll().then(
      res => callback({ success: true, data: res }),
      err => callback({ success: false, message: err })
    );
  },

  addMunicipal: function(name, callback) {
    Municipals.create({
      name: name
    }).then(
      result =>
        callback({
          success: true,
          message: { en: 'Municipal added.', no: 'Kommunen ble lagt til.' },
          id: result.id
        }),
      err => callback({ success: false, message: err })
    );
  }
};
