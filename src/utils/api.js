import axios from 'axios';

// runtime override (window.__BACKEND_URL__), then REACT_APP_API_URL, then same-origin
const RUNTIME = (typeof window !== 'undefined' && window.__BACKEND_URL__) ? window.__BACKEND_URL__ : null;
export const BASE = (RUNTIME || process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');

export const api = axios.create({
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
      // only set if not already provided
      if (!config.headers.Authorization && !config.headers.authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (e) {
    /* ignore non-browser */
  }
  return config;
}, (error) => Promise.reject(error));

import { api } from './api';

export const post = (path, data, opts = {}) => api.post(path, data, opts);
export const get = (path, opts = {}) => api.get(path, opts);
export const put = (path, data, opts = {}) => api.put(path, data, opts);
export const del = (path, opts = {}) => api.delete(path, opts);

export default api;