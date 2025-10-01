import axios from 'axios';

// runtime override (window.__BACKEND_URL__), then env REACT_APP_API_URL, then same-origin
const RUNTIME = (typeof window !== 'undefined' && window.__BACKEND_URL__) ? window.__BACKEND_URL__ : null;
export const BASE = (RUNTIME || process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');

// single declaration of the axios instance
const api = axios.create({
  baseURL: BASE || '',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token automatically if available
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      if (!config.headers.Authorization && !config.headers.authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (e) {
    // ignore in non-browser environments
  }
  return config;
}, (error) => Promise.reject(error));

export { api };
export default api;