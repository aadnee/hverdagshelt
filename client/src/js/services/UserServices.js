import api from './api';

class UserService {
  login(email, password) {
    return api.post('/api/login', { email: email, password: password });
  }

  register(name, email, phone, municipalId) {
    return api.post('/api/register', {
      name: name,
      email: email,
      phone: phone,
      municipalId: municipalId
    });
  }

  getUsers() {
    return api.get('/api/users');
  }

  getUser(id) {
    return api.get('/api/users/' + id);
  }

  editUser(id, name, email, phone, municipalId, rank) {
    console.log(id, name, email, phone, municipalId, rank);
    return api.put('/api/users/' + id, {
      name: name,
      email: email,
      phone: phone,
      municipalId: municipalId,
      rank: rank
    });
  }

  deleteUser(id) {
    return api.delete('/api/users/' + id);
  }

  getMe() {
    return api.get('/api/me');
  }

  editMe(name, email, phone, municipalId) {
    console.log(name + ' ' + email);
    return api.put('/api/me', {
      name: name,
      email: email,
      phone: phone,
      municipalId: municipalId
    });
  }
}
export let userService = new UserService();
