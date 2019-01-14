import { Tickets } from '../models';
import newsManager from './newsManager';

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
          message: 'Ticket sent.',
          id: res.id
        }),
      err => callback({ success: false, message: err })
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
      { where: { id: ticketId, userId: userId } }
    ).then(
      res =>
        callback({
          success: true,
          message: 'Ticket saved.'
        }),
      err => callback({ success: false, message: err })
    );
  },

  setStatus: function(status, ticketId, callback) {
    Tickets.update({ status: status }, { where: { id: ticketId, status: 1 } }).then(
      res =>
        callback({
          success: true,
          message: 'Status updated.'
        }),
      err => callback({ success: false, message: err })
    );
  },

  //get all tickets submitted by a specific user
  getMyTickets: function(userId, callback) {
    Tickets.findAll({ where: { userId: userId } }).then(
      res => callback({ success: true, data: res }),
      err => callback({ success: false, message: err })
    );
  },

  //get all tickets in a specific municipal
  getLocalTickets: function(municipalId, callback) {
    Tickets.findAll({ where: { municipalId: municipalId } }).then(
      res => callback({ success: true, data: res }),
      err => callback({ success: false, message: err })
    );
  },

  makeNews: function(ticketId, title, description, lat, lon, categoryId, municipalId, callback) {
    this.setStatus(3, ticketId, function(result) {
      if (result.success) {
        newsManager.addArticle(title, description, categoryId, lat, lon, municipalId, function(result) {
          if (result.success) {
            Tickets.update(
              {
                newsId: result.id
              },
              { where: { id: ticketId } }
            ).then(res => callback(result), err => callback({ success: false, message: err }));
          } else {
            callback(result);
          }
        });
      } else {
        callback(result);
      }
    });
  }
};
