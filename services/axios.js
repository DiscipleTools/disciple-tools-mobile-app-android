import axios from 'axios';

// 15 sec default timeout for all requests
const timeout = 15000;
const protocol = 'https';

export const getBaseUrl = (domain) => {
  return `${protocol}://${domain}/wp-json/`;
};

// NOTE: the baseURL and Authorization Header will be set upon successful login,
// for subsequent reuse with JWT, etc... (see: hooks/useMyUser::login(..))
const instance = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  timeout,
});
// TODO: intercept timeout error and provide better message (useResource/useRequest)
export default instance;
