import moment from 'moment';
import { Events } from '../models';

module.exports = {
  getFilteredEvents: function(municipalIds, page, limit, callback) {
    Events.findAll({
      where: { municipalId: municipalIds, end: { $gte: moment().format('YYYY-MM-DD') }, active: true },
      offset: page == 0 ? null : (page - 1) * limit,
      limit: limit == 0 ? null : limit,
      order: [['id', 'DESC']]
    }).then(res => callback({ success: true, data: res }), err => callback({ success: false, message: err }));
  },

  addEvent: function(title, description, area, address, start, end, municipalId, url, callback) {
    Events.create({
      title: title,
      description: description,
      area: area,
      address: address,
      start: start,
      end: end,
      municipalId: municipalId,
      url: url
    }).then(
      res => callback({ success: true, message: { en: 'Event added.', no: 'Arrangementet ble lagt til.' } }),
      err => callback({ success: false, message: err })
    );
  },

  editEvent: function(eventId, title, description, area, address, start, end, municipalId, url, callback) {
    Events.update(
      {
        title: title,
        description: description,
        area: area,
        address: address,
        start: start,
        end: end,
        municipalId: municipalId,
        url: url
      },
      { where: { id: eventId } }
    ).then(
      res => callback({ success: true, message: { en: 'Event edited.', no: 'Arrangementet ble endret.' } }),
      err => callback({ success: false, message: err })
    );
  },

  deleteEvent: function(eventId, callback) {
    Events.update({ active: false }, { where: { id: eventId } }).then(
      res => callback({ success: true, message: { en: 'Event deleted.', no: 'Arrangementet ble slettet.' } }),
      err => callback({ success: false, message: err })
    );
  }
};
