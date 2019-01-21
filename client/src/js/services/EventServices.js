import api from './api';

class EventServices {
  getFilteredEvents(municipalIds, page, limit) {
    return api.post('/api/events/filter', {
      municipalIds: municipalIds,
      page: page,
      limit: limit
    });
  }

  addEvent(title, description, lat, lon, address, start, end, municipalId) {
    return api.post('/api/events', {
      title: title,
      description: description,
      lat: lat,
      lon: lon,
      address: address,
      start: start,
      end: end,
      municipalId: municipalId
    });
  }

  editEvent(eventId, title, description, lat, lon, address, start, end, municipalId) {
    return api.put('/api/events/' + eventId, {
      title: title,
      description: description,
      lat: lat,
      lon: lon,
      address: address,
      start: start,
      end: end,
      municipalId: municipalId
    });
  }

  deleteEvent(eventId) {
    return api.delete('/api/events/' + eventId);
  }
}

export let eventService = new EventServices();
