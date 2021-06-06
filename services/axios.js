import axios from 'axios';

// TODO: get domain from Secure Store
const domain = '';
// TODO: get JWT token from Secure Store
const token = '';

//const domain = yield SecureStore.getItemAsync('domain');
//const token = yield SecureStore.getItemAsync('authToken');

const instance = axios.create({
  baseURL: `http://${domain}/wp-json/`,
  headers: {
    Authorization: `Bearer ${token}`,
  },
  // TODO: intercept timeout error and provide better message (in useResource/useRequest)?
  timeout: 15000,
});
export default instance;
