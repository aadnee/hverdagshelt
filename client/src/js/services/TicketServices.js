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

  //edit, delete, fetch functions
}

export let ticketService = new TicketServices();
