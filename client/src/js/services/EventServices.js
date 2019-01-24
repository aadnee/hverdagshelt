import api from './api';

class EventServices {
  getFilteredEvents(municipalIds, page, limit) {
    return api.post('/api/events/filter', {
      municipalIds: municipalIds,
      page: page,
      limit: limit
    });
  }

  getEvents() {
    return api.get('/api/events');
  }

  addEvent(title, description, area, address, start, end, municipalId, url) {
    return api.post('/api/events', {
      title: title,
      description: description,
      area: area,
      address: address,
      start: start,
      end: end,
      municipalId: municipalId,
      url: url
    });
  }

  editEvent(eventId, title, description, area, address, start, end, municipalId, url) {
    return api.put('/api/events/' + eventId, {
      title: title,
      description: description,
      area: area,
      address: address,
      start: start,
      end: end,
      municipalId: municipalId,
      url: url
    });
  }

  deleteEvent(eventId) {
    return api.delete('/api/events/' + eventId);
  }
}

export let eventService = new EventServices();
