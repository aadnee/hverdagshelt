import api from './api';

class MunicipalServices {
  getMunicipals() {
    return api.get('/api/municipals');
  }

  addMunicipal() {
    return api.post('/api/municipals');
  }
}
