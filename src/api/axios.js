// src/api/axios.js
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Cambio aquí

const instance = axios.create({
  baseURL: 'http://localhost:3000/api',
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode(token); // Cambio aquí
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return config;
      }
      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.error("Error decodificando token:", error);
    }
  }
  return config;
}, (error) => Promise.reject(error));

export default instance;