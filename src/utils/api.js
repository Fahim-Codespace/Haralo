import axios from 'axios';

// Allow a runtime override (window.__BACKEND_URL__), then REACT_APP_API_URL, then same-origin.
const RUNTIME = typeof window !== 'undefined' && window.__BACKEND_URL__ ? window.__BACKEND_URL__ : null;
export const BASE = (RUNTIME || process.env.REACT_APP_API_URL || '').replace(/\/+$/, '');

export const api = axios.create({
  baseURL: BASE || '',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});