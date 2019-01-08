import axios from 'axios';
axios.interceptors.response.use(response => response.data);

class User {
  id;
  firstName;
  lastName;
  email;
  password;
  rank;
  companyId;
  municipalId;
}

class UserService {
  getUsers() {
    return axios.get('/users');
  }

  getUser(id) {
    return axios.get('/users/' + id);
  }

  updateUser(user) {
    return axios.put('/users', user);
  }
}
export let userService = new UserService();
