import axios from 'axios';

// TODO: get domain from Secure Store
// TODO: get JWT token from Secure Store
//baseURL: "https://${domain}/wp-json/"
const instance = axios.create({
  baseURL: 'http://192.168.1.7:80/wp-json/',
  headers: {
    Authorization:
      'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjEuNyIsImlhdCI6MTYyMTczNDE4NywibmJmIjoxNjIxNzM0MTg3LCJleHAiOjE2MjIzMzg5ODcsImRhdGEiOnsidXNlciI6eyJpZCI6IjEifX19.ZF0Yd4P_irCqwgsjN5TvLzAg0CoLO5QIK6RWc4jsotE',
  },
  timeout: 15000,
});
export default instance;
