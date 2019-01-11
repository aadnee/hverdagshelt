import axios from 'axios';

axios.interceptors.response.use(response => response.data);

class TicketServices {
  addTicket(title, description, lat, lon, categoryId, municipalId) {
    return axios.post('api/tickets', {
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
