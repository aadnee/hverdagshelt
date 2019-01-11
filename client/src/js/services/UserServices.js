import api from './api';


class UserService {
  login(email, password) {
    return api.post('/api/login', { email: email, password: password });
  }

  register(firstName, lastName, email, phone, municipalId) {
    return api.post('/api/register', {
      firstName: firstName,
      lastName: lastName,
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

  deleteUser(id) {
    return axios.delete('/api/users/' + id);
  }
}
export let userService = new UserService();
