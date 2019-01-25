import { Tickets, Users, Uploads, Categories, News, sequelize } from '../models';
import newsManager from './newsManager';
import mailManager from './mailManager';
import subscriptionManager from './subscriptionManager';
import moment from 'moment';

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
          message: { en: 'Ticket sent.', no: 'Varslingen ble sendt.' },
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
          message: { en: 'Ticket saved.', no: 'Varslingen ble lagret.' }
        }),
      err => callback({ success: false, message: err })
    );
  },

  setStatus: function(status, ticketId, newsId, feedback, callback) {
    Tickets.update({ status: status, newsId: newsId, feedback: feedback }, { where: { id: ticketId } }).then(
      res => {
        Users.findOne({
          attributes: ['id', 'email', 'notifications'],
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
                    res.email,
                    function() {}
                  )
                : null;
              status == 3
                ? subscriptionManager.addSubscription(newsId, res.id, function(result) {
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
    Tickets.findAll({
      include: [{ model: Uploads }],
      where: { userId: userId },
      order: [['id', 'DESC']]
    }).then(res => callback({ success: true, data: res }), err => callback({ success: false, message: err }));
  },

  //get all tickets in a specific municipal
  getLocalTickets: function(municipalId, callback) {
    Tickets.findAll({
      include: [{ model: Uploads, required: false }],
      where: { municipalId: municipalId, status: 1 },
      order: [['id', 'ASC']]
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
        ticketManager.setStatus(3, ticketId, result.id, null, function(res) {
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
          callback({ success: true, message: { en: 'Ticket removed.', no: 'Varslingen ble trukket tilbake.' } });
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
  getTicketStatistics: function(municipalId, year, month, week, callback) {
    let start;
    let end;
    if (municipalId == null || year == null) {
      callback({ success: false, message: 'MunicipalId and year is required' });
    } else {
      if (week == null && month == null && year != null) {
        start = moment(year + '-01-01');
        end = moment(year + '-12-31');
      } else if (week == null && month != null && year != null) {
        start = moment(year + '-' + month + '-01');
        end = moment(year + '-' + month + '-01').endOf('month');
      } else if (week != null && year != null) {
        start = moment(year + '-01-01')
          .day('Monday')
          .week(week);

        week += 1;
        end = moment(year + '-01-01')
          .day('Monday')
          .week(week);
      }
      Categories.findAll({
        attributes: ['name'],
        include: [
          {
            attributes: ['name'],
            model: Categories,
            required: false,
            as: 'subs',
            include: [
              {
                attributes: ['id'],
                model: Tickets,
                required: false,
                where: {
                  createdAt: {
                    $gte: start,
                    $lte: end
                  },
                  municipalId: municipalId
                }
              },
              {
                attributes: ['id'],
                model: News,
                required: false,
                where: {
                  createdAt: {
                    $gte: start,
                    $lte: end
                  },
                  municipalId: municipalId,
                  status: 3
                }
              }
            ]
          }
        ],
        where: { parentId: null }
      }).then(res => {
        let stats = [];
        let total;
        res.map((cat, i) => {
          total = 0;
          stats.push({ name: cat.name, total: 0, subs: [] });
          cat.subs.map(sub => {
            stats[i].subs.push({
              name: sub.name,
              tickets: sub.tickets.length,
              finished: sub.news.length
            });
            total += parseInt(sub.tickets.length);
          });
          stats[i].total = total;
        });
        callback({ success: true, data: stats, start: start.format('DD/MM/YYYY'), end: end.format('DD/MM/YYYY') }),
          err => callback({ success: false, message: err });
      });
    }
  }
};
