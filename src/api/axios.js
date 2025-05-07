import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8005/',
});

api.interceptors.request.use(
  (config) => {
    const adminToken = localStorage.getItem('authToken');
    console.log('Admin Token:', adminToken); // Debugging line
    if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default api;