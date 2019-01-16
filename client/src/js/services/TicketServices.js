import api from './api';

class TicketServices {
  addTicket(title, description, lat, lon, categoryId, municipalId, subscribed, image) {
    var formData = new FormData();
    formData.append('image', image ? image[0] : null);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('lat', lat);
    formData.append('lon', lon);
    formData.append('categoryId', categoryId);
    formData.append('municipalId', municipalId);
    formData.append('subscribed', subscribed);
    return api.post('api/tickets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
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
  acceptTicket(id, title, description, lat, lon, categoryId, municipalId) {
    return api.put('/api/tickets/' + id + '/accept', {
      title: title,
      description: description,
      lat: lat,
      lon: lon,
      categoryId: categoryId,
      municipalId: municipalId
    });
  }

  //edit, delete, add
}

export let ticketService = new TicketServices();
