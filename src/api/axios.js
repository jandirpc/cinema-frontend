// src/api/axios.js
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode(token);
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