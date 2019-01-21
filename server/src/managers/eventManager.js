import { Events } from '../models';

module.exports = {
  getFilteredEvents: function(municipalIds, page, limit, callback) {
    Events.findAll({
      where: { municipalId: municipalIds, end: { $gt: Date.now() } },
      offset: page == 0 ? null : (page - 1) * limit,
      limit: limit == 0 ? null : limit,
      order: [['id', 'DESC']]
    }).then(res => callback({ success: true, data: res }), err => callback({ success: false, message: err }));
  },

  addEvent: function(title, description, lat, lon, address, start, end, municipalId, callback) {
    Events.create({
      title: title,
      description: description,
      lat: lat,
      lon: lon,
      address: address,
      start: start,
      end: end,
      municipalId: municipalId
    }).then(
      res => callback({ success: true, message: { en: 'Event added.', no: 'Arrangementet ble lagt til.' } }),
      err => callback({ success: false, message: err })
    );
  },

  editEvent: function(eventId, title, description, lat, lon, address, start, end, municipalId, callback) {
    Events.update(
      {
        title: title,
        description: description,
        lat: lat,
        lon: lon,
        address: address,
        start: start,
        end: end,
        municipalId: municipalId
      },
      { where: { id: eventId } }
    ).then(
      res => callback({ success: true, message: { en: 'Event edited.', no: 'Arrangementet ble endret.' } }),
      err => callback({ success: false, message: err })
    );
  },

  deleteEvent: function(eventId, callback) {
    Events.destroy({ where: { id: eventId } }).then(
      res => callback({ success: true, message: { en: 'Event deleted.', no: 'Arrangementet ble slettet.' } }),
      err => callback({ success: false, message: err })
    );
  }
};
