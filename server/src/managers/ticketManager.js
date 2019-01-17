import { Tickets } from '../models';
import newsManager from './newsManager';

module.exports = {
  addTicket: function(title, description, lat, lon, categoryId, municipalId, subscribed, userId, image, callback) {
    Tickets.create({
      title: title,
      description: description,
      status: 1,
      lat: lat,
      lon: lon,
      categoryId: categoryId,
      userId: userId,
      subscribed: subscribed,
      municipalId: municipalId,
      image: image
    }).then(
      res =>
        callback({
          success: true,
          message: { en: 'Ticket sent.', no: 'Varselen ble sent.' },
          id: res.id
        }),
      err => callback({ success: false, message: err })
    );
  },

  editTicket: function(
    title,
    description,
    lat,
    lon,
    categoryId,
    municipalId,
    subscribed,
    userId,
    ticketId,
    image,
    callback
  ) {
    Tickets.update(
      {
        title: title,
        description: description,
        lat: lat,
        lon: lon,
        categoryId: categoryId,
        municipalId: municipalId,
        subscribed: subscribed,
        image: image
      },
      { where: { id: ticketId, userId: userId } }
    ).then(
      res =>
        callback({
          success: true,
          message: { en: 'Ticket saved.', no: 'Varselen ble lagret.' }
        }),
      err => callback({ success: false, message: err })
    );
  },

  setStatus: function(status, ticketId, newsId, callback) {
    Tickets.update({ status: status, newsId: newsId }, { where: { id: ticketId } }).then(
      res =>
        callback({
          success: true,
          message: { en: 'Status updated.', no: 'Statusen ble oppdatert.' }
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
    Tickets.findAll({ where: { municipalId: municipalId, status: 1 } }).then(
      res => callback({ success: true, data: res }),
      err => callback({ success: false, message: err })
    );
  },

  makeNews: function(ticketId, title, description, lat, lon, categoryId, municipalId, callback) {
    let ticketManager = this;
    newsManager.addArticle(title, description, categoryId, lat, lon, municipalId, function(result) {
      if (result.success) {
        ticketManager.setStatus(3, ticketId, result.id, function(res) {
          callback(result);
        });
      } else {
        callback(result);
      }
    });
  }
};
