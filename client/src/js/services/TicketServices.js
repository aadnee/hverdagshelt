import api from './api';

class TicketServices {
  addTicket(title, description, lat, lon, categoryId, municipalId) {
    return api.post('api/tickets', {
      title: title,
      description: description,
      lat: lat,
      lon: lon,
      categoryId: categoryId,
      municipalId: municipalId
    });
  }

  getTickets() {
    return api.get('api/mytickets');
  }

  getMunicipalTickets(id) {
    return api.get('api/tickets/municipal/' + id);
  }

  rejectTicket(id) {
    return api.put('/api/tickets/' + id + '/reject');
  }

  //edit, delete, fetch functions
}

export let ticketService = new TicketServices();
