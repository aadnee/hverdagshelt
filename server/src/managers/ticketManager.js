import { Tickets } from '../models';

module.exports = {
  addTicket: function(title, description, lat, lon, categoryId, municipalId, userId) {
    console.log(title, userId);
    return new Promise(function(resolve, reject) {
      if (
        title == null ||
        title == '' ||
        description == null ||
        description == '' ||
        lat == null ||
        lat == '' ||
        lon == null ||
        lon == '' ||
        categoryId == null ||
        categoryId == '' ||
        userId == null ||
        userId == '' ||
        municipalId == null ||
        municipalId == ''
      ) {
        resolve({
          success: false,
          message: 'Fields cannot be empty.'
        });
      }

      Tickets.create({
        title: title,
        description: description,
        status: 1,
        lat: lat,
        lon: lon,
        categoryId: categoryId,
        userId: userId,
        municipalId: municipalId
      });
      resolve({
        success: true,
        message: 'Ticket sent.'
      });
    });
  }
};
