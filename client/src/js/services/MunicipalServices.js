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
      method: 'POST',
      url: '/api/statistics/' + municipalId,
      data: {
        year: year,
        month: month,
        week: week
      },
      responseType: 'arraybuffer'
      //accept: 'application/pdf'
    });
  }
}

export let municipalService = new MunicipalServices();
