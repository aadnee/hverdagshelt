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

  getUser(userId) {
    return api.get('/api/users/' + userId);
  }

  editUser(userId, name, email, phone, municipalId, rank) {
    console.log(userId, name, email, phone, municipalId, rank);
    return api.put('/api/users/' + userId, {
      name: name,
      email: email,
      phone: phone,
      municipalId: municipalId,
      rank: rank
    });
  }

  deleteUser(userId) {
    return api.delete('/api/users/' + userId);
  }

  async getMe() {
    let name;
    let me = await api.get('/api/me').then(res => {
      name = res.data.name.split(' ');
      if (name.length > 1) {
        res.data.lastName = name.pop();
        res.data.firstName = name.join(' ');
      } else {
        res.data.firstName = name;
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

  getMunicipals() {
    return api.get('/api/mymunicipals');
  }

  addMunicipal(municipalId) {
    console.log('add' + municipalId);
    return api.post('/api/mymunicipals', {
      municipalId: municipalId
    });
  }

  deleteMunicipal(municipalId) {
    console.log('delete' + municipalId);
    return api.delete('/api/mymunicipals/' + municipalId);
  }
}
export let userService = new UserService();
