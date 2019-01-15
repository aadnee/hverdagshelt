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

  editCompany(id, name, email, phone, municipalId) {
    return api.put('/api/companies/' + id, {
      name: name,
      email: email,
      phone: phone,
      municipalId: municipalId
    });
  }

  deleteCompany(id) {
    return api.delete('/api/companies/' + id);
  }
}

export let companyService = new CompanyServices();
