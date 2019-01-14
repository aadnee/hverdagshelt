import api from './api';

class CompanyServices {
  getCompany(id) {
    return api.get('/api/companies/' + id);
  }

  getCompanies() {
    return api.get('/api/companies');
  }

  getLocalCompanies(municipalId) {
    return api.get('/api/companies/municipal/' + municipalId);
  }

  addCompany(name, email, phone, municipalId) {
    return api.post('/api/companies', {
      name: name,
      email: email,
      phone: phone,
      municipalId: municipalId
    });
  }

  editCompany(municipalId, name, email, phone) {
    return api.put('/api/companies/municipal/' + municipalId, {
      name: name,
      email: email,
      phone: phone,
      municipalId: municipalId
    });
  }

  deleteCompany(id) {
    return api.delete('/api/companies/:' + id);
  }
}

export let companyServices = new CompanyServices();
