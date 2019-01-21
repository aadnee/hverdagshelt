import api from './api';

class TicketServices {
  addTicket(title, description, lat, lon, address, categoryId, municipalId, subscribed, images) {
    let formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }
    formData.append('title', title);
    formData.append('description', description);
    formData.append('lat', lat);
    formData.append('lon', lon);
    formData.append('address', address);
    formData.append('categoryId', categoryId);
    formData.append('municipalId', municipalId);
    formData.append('subscribed', subscribed);
    return api.post('/api/tickets', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  getTickets() {
    return api.get('/api/mytickets');
  }

  getMunicipalTickets(ticketId) {
    return api.get('/api/tickets/municipal/' + ticketId);
  }

  rejectTicket(ticketId) {
    return api.put('/api/tickets/' + ticketId + '/reject');
  }

  linkTicket(ticketId, newsId) {
    return api.put('/api/tickets/' + ticketId + '/link', {
      newsId: newsId
    });
  }

  deleteTicket(ticketId) {
    return api.delete('/api/tickets/' + ticketId + '/withdraw');
  }

  acceptTicket(ticketId, title, description, lat, lon, address, categoryId, municipalId, images) {
    return api.put('/api/tickets/' + ticketId + '/accept', {
      title: title,
      description: description,
      lat: lat,
      lon: lon,
      address: address,
      categoryId: categoryId,
      municipalId: municipalId,
      images: images
    });
  }

  updateTicket(ticketId, title, description, lat, lon, address, categoryId, municipalId, subscribed) {
    return api.put('/api/tickets/' + ticketId, {
      title: title,
      description: description,
      lat: lat,
      lon: lon,
      address: address,
      categoryId: categoryId,
      municipalId: municipalId,
      subscribed: subscribed
    });
  }
}

export let ticketService = new TicketServices();
