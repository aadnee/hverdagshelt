import api from './api';

class TicketServices {
  addTicket(title, description, lat, lon, address, categoryId, subscribed, images, municipalName) {
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
    formData.append('municipalName', municipalName);
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

  getTicketsPending() {
    return api.get('/api/tickets/pending');
  }

  getMunicipalTickets(ticketId) {
    return api.get('/api/tickets/municipal/' + ticketId);
  }

  rejectTicket(ticketId, feedback) {
    return api.put('/api/tickets/' + ticketId + '/reject', { feedback: feedback });
  }

  linkTicket(ticketId, newsId) {
    console.log(ticketId);
    console.log(newsId);
    return api.put('/api/tickets/' + ticketId + '/link', {
      newsId: newsId
    });
  }

  deleteTicket(ticketId) {
    return api.delete('/api/tickets/' + ticketId + '/withdraw');
  }

  acceptTicket(ticketId, title, description, lat, lon, address, categoryId, publish, municipalId, images) {
    return api.put('/api/tickets/' + ticketId + '/accept', {
      title: title,
      description: description,
      lat: lat,
      lon: lon,
      address: address,
      categoryId: categoryId,
      publish: publish,
      municipalId: municipalId,
      imageIds: images
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
