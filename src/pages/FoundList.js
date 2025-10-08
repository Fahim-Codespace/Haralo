import React, { useEffect, useState } from 'react';
import { api } from './api';

export const post = (path, data, opts = {}) => api.post(path, data, opts);
export const get = (path, opts = {}) => api.get(path, opts);
export const put = (path, data, opts = {}) => api.put(path, data, opts);
export const del = (path, opts = {}) => api.delete(path, opts);

const FoundList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await get('/api/report-found');
        if (res && res.status === 200) setItems(res.data || []);
        else setItems([]);
      } catch (err) {
        console.error('Load found items', err);
        setItems([]);
      }
    };
    load();
  }, []);

  return (
    <div>
      {/* Render your items here */}
    </div>
  );
};

export default FoundList;