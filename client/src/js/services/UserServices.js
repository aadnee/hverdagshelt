import axios from 'axios';

axios.interceptors.response.use(response => response.data);

class UserService {
  login(email, password) {
    return axios.post('/api/login', { email: email, password: password });
  }

  register(firstName, lastName, email, phone, municipalId) {
    return axios.post('/api/register', {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phone: phone,
      municipalId: municipalId
    });
  }

  getUsers() {
    return axios.get('/api/users');
  }

  getUser(id) {
    return axios.get('/api/users/' + id);
  }

  deleteUser(id) {
    return axios.delete('/api/users/' + id);
  }
}
export let userService = new UserService();
