import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://hverdagshelt.pro:3001'
});

instance.interceptors.response.use(response => response.data);

export default instance;
