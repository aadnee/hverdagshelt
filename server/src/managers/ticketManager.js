import { Tickets } from '../models';

module.exports = {
  addTicket: function(title, description, lat, lon, categoryId, municipalId, userId, callback) {
    Tickets.create({
      title: title,
      description: description,
      status: 1,
      lat: lat,
      lon: lon,
      categoryId: categoryId,
      userId: userId,
      municipalId: municipalId
    })
      .then(() =>
        callback({
          success: true,
          message: 'Ticket sent.'
        })
      )
      .catch(function(err) {
        callback({ success: false, message: 'Sequelize error' });
      });
  },

  editTicket: function(title, description, lat, lon, categoryId, municipalId, userId, ticketId, callback) {
    Tickets.update(
      {
        title: title,
        description: description,
        lat: lat,
        lon: lon,
        categoryId: categoryId,
        municipalId: municipalId
      },
      { where: { $and: { id: ticketId, userId: userId } } }
    )
      .then(() =>
        callback({
          success: true,
          message: 'Ticket saved.'
        })
      )
      .catch(function(err) {
        callback({ success: false, message: 'Sequelize error' });
      });
  },

  setStatus: function(status, ticketId, callback) {
    Tickets.update({ status: status }, { where: { id: ticketId } })
      .then(() =>
        callback({
          success: true,
          message: 'Status updated.'
        })
      )
      .catch(function(err) {
        callback({ success: false, message: 'Sequelize error' });
      });
  }
};
