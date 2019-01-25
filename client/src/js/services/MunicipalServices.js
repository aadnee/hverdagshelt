import api from './api';

class MunicipalServices {
  getMunicipals() {
    return api.get('/api/municipals');
  }

  addMunicipal() {
    return api.post('/api/municipals');
  }

  getMunicipalStatistics(municipalId, year, month, week) {
    return api({
      method: most,
      url: '/api/statistics/' + municipalId,
      data: {
        year: year,
        month: month,
        week: week
      },
      responseType: 'stream'
    });
  }
}

export let municipalService = new MunicipalServices();
