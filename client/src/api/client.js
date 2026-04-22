import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_URL,
});

//for every request to backend apis, axios will run this interceptors function
//and add the token from localStorage to the authorization header
//we need to send this token to backend for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token){
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
