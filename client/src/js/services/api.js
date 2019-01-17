import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://10.22.150.50:3000'
});

instance.interceptors.response.use(response => response.data);

export default instance;
