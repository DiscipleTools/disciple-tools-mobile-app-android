import axios from 'axios';

// TODO: get domain from Secure Store
const domain = '';
// TODO: get JWT token from Secure Store
const token = '';
const instance = axios.create({
  baseURL: `http://${domain}/wp-json/`,
  headers: {
    Authorization: `Bearer ${token}`,
  },
  timeout: 15000,
});
export default instance;
