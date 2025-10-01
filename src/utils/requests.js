import { api } from './api';
export const post = (path, data, opts) => api.post(path, data, opts);
export const get = (path, opts) => api.get(path, opts);
export const put = (path, data, opts) => api.put(path, data, opts);
export const del = (path, opts) => api.delete(path, opts);