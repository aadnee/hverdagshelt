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

  async getMe() {
    let name;
    let me = await api.get('/api/me').then(res => {
      name = res.data.name.split(' ');
      if (name.length > 1) {
        res.data.lastName = name.pop();
        res.data.firstName = name.join(' ');
      }
      return res;
    });
    return me;
  }

  editMe(firstName, lastName, email, phone, municipalId, oldPassword, newPassword) {
    console.log(name + ' ' + email);
    return api.put('/api/me', {
      name: String(firstName + ' ' + lastName),
      email: email,
      phone: phone,
      municipalId: municipalId,
      oldPassword: oldPassword,
      newPassword: newPassword
    });
  }
}
export let userService = new UserService();
