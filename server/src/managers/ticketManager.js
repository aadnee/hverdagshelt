import { Tickets, Users, Uploads, Categories, sequelize } from '../models';
import newsManager from './newsManager';
import mailManager from './mailManager';
import subscriptionManager from './subscriptionManager';

module.exports = {
  addTicket: function(
    title,
    description,
    lat,
    lon,
    address,
    categoryId,
    municipalId,
    subscribed,
    images,
    userId,
    callback
  ) {
    Tickets.create({
      title: title,
      description: description,
      status: 1,
      lat: lat,
      lon: lon,
      address: address,
      categoryId: categoryId,
      userId: userId,
      subscribed: subscribed,
      municipalId: municipalId
    }).then(
      res => {
        let ticketId = res.id;
        images.map(img =>
          Uploads.create({
            filename: img.filename,
            ticketId: ticketId
          }).then(res => null, err => callback({ success: false, message: err }))
        );
        callback({
          success: true,
          message: { en: 'Ticket sent.', no: 'Varselen ble sent.' },
          id: res.id
        });
      },
      err => callback({ success: false, message: err })
    );
  },

  editTicket: function(
    title,
    description,
    lat,
    lon,
    address,
    categoryId,
    municipalId,
    subscribed,
    userId,
    ticketId,
    callback
  ) {
    Tickets.update(
      {
        title: title,
        description: description,
        lat: lat,
        lon: lon,
        address: address,
        categoryId: categoryId,
        municipalId: municipalId,
        subscribed: subscribed
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
      res => {
        Users.findOne({
          attributes: ['email', 'notifications'],
          include: [{ attributes: ['subscribed', 'title'], model: Tickets, required: true, where: { id: ticketId } }]
        }).then(
          res => {
            let textStatus = status == 4 ? 'underkjent' : 'godkjent';
            if (res != null && res.tickets[0].subscribed) {
              res.notifications
                ? mailManager.send(
                    'Ditt varsel er oppdatert',
                    '<h3>Ditt varsel "' +
                      res.tickets[0].title +
                      '" ble ' +
                      textStatus +
                      '.</h3><h4>Sjekk Hverdagshelt nettsiden for mer informasjon.</h4>',
                    res.email
                  )
                : null;
              status == 3
                ? subscriptionManager.addSubscription(newsId, res.id, function() {
                    callback({
                      success: true,
                      message: { en: 'Status updated.', no: 'Statusen ble oppdatert.' }
                    });
                  })
                : callback({
                    success: true,
                    message: { en: 'Status updated.', no: 'Statusen ble oppdatert.' }
                  });
            } else {
              callback({
                success: true,
                message: { en: 'Status updated.', no: 'Statusen ble oppdatert.' }
              });
            }
          },
          err => callback({ success: false, message: err })
        );
      },
      err => callback({ success: false, message: err })
    );
  },

  //get all tickets submitted by a specific user
  getMyTickets: function(userId, callback) {
    Tickets.findAll({ include: [{ model: Uploads }], where: { userId: userId } }).then(
      res => callback({ success: true, data: res }),
      err => callback({ success: false, message: err })
    );
  },

  //get all tickets in a specific municipal
  getLocalTickets: function(municipalId, callback) {
    Tickets.findAll({
      include: [{ model: Uploads, required: false }],
      where: { municipalId: municipalId, status: 1 }
    }).then(res => callback({ success: true, data: res }), err => callback({ success: false, message: err }));
  },

  makeNews: function(ticketId, title, description, lat, lon, address, categoryId, municipalId, imageIds, callback) {
    let ticketManager = this;
    newsManager.addArticle(title, description, categoryId, lat, lon, address, municipalId, function(result) {
      if (result.success) {
        imageIds.map(imageId => {
          Uploads.update(
            {
              newsId: result.id
            },
            { where: { id: imageId } }
          ).then(res => null, err => callback({ success: false, message: err }));
        });
        ticketManager.setStatus(3, ticketId, result.id, function(res) {
          callback(result);
        });
      } else {
        callback(result);
      }
    });
  },

  withdraw: function(userId, ticketId, callback) {
    Tickets.update({ status: 5 }, { where: { id: ticketId, userId: userId } }).then(
      res => {
        if (res != 0) {
          callback({ success: true, message: { en: 'Ticket removed.', no: 'Varsel ble trukket tilbake.' } });
        } else {
          callback({
            success: false,
            message: { en: 'Access denied.', no: 'Ingen tilgang.' }
          });
        }
      },

      err => callback({ success: false, message: err })
    );
  },

  getPendingTicketCount: function(callback) {
    Tickets.count({ where: { status: 1 } }).then(
      res => callback({ success: true, data: res }),
      err => callback({ success: false, message: err })
    );
  },

  //statistics
  getYearly: function(year, municipalId, categoryId, callback) {
    if (categoryId != null) {
      Tickets.count({
        where: {
          createdAt: {
            $gte: new Date(year + '-01-01'),
            $lte: new Date(year + '-12-31')
          },
          municipalId: municipalId,
          categoryId: categoryId
        }
      }).then(res => callback({ success: true, data: res }), err => callback({ success: false, message: err }));
    } else {
      Tickets.count({
        where: {
          createdAt: {
            $gte: new Date(year + '-01-01'),
            $lte: new Date(year + '-12-31')
          },
          municipalId: municipalId
        }
      }).then(res => callback({ success: true, data: res }), err => callback({ success: false, message: err }));
    }
  },

  getMonthly: function(month, year, municipalId, callback) {
    // Tickets.count({
    //   where: {
    //     createdAt: {
    //       $gte: new Date(year + '-' + month + '-01'),
    //       $lte: new Date(year + '-' + month + '-31')
    //     },
    //     municipalId: municipalId
    //   }
    // }).then(res => callback({ success: true, data: res }), err => callback({ success: false, message: err }));

    Categories.findAll({
      attributes: ['name'],
      include: [
        {
          required: false,
          attributes: [[sequelize.fn('COUNT', 'Tickets.categoryId'), 'amount']],
          model: Tickets,
          where: {
            createdAt: {
              $gte: new Date(year + '-' + month + '-01'),
              $lte: new Date(year + '-' + month + '-31')
            },
            municipalId: municipalId
          }
        }
      ],
      where: { parentId: null },
      group: ['Tickets.categoryId']
    }).then(res => callback({ success: true, data: res }), err => callback({ success: false, message: err }));
  }
};
