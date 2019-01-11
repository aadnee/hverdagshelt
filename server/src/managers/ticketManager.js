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
    }).then(
      res =>
        callback({
          success: true,
          message: 'Ticket sent.'
        }),
      err => callback({ success: false, message: 'Sequelize error' })
    );
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
    ).then(
      res =>
        callback({
          success: true,
          message: 'Ticket saved.'
        }),
      err => callback({ success: false, message: 'Sequelize error' })
    );
  },

  setStatus: function(status, ticketId, callback) {
    Tickets.update({ status: status }, { where: { id: ticketId } }).then(
      res =>
        callback({
          success: true,
          message: 'Status updated.'
        }),
      err => callback({ success: false, message: 'Sequelize error' })
    );
  },

  //get all tickets submitted by a specific user
  getMyTickets: function(userId, callback) {
    Tickets.findAll({ where: { id: userId } }).then(
      res => callback({ success: true, data: res }),
      err => callback({ success: false, message: 'Sequelize error' })
    );
  },

  //get all tickets in a specific municipal
  getLocalTickets: function(municipalId, callback) {
    Tickets.findAll({ where: { municipalId: municipalId } }).then(
      res => callback({ success: true, data: res }),
      err => callback({ success: false, message: 'Sequelize error' })
    );
  }
};
