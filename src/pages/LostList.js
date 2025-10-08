import React, { useEffect, useState } from 'react';
import { api } from './api';

export const post = (path, data, opts = {}) => api.post(path, data, opts);
export const get = (path, opts = {}) => api.get(path, opts);
export const put = (path, data, opts = {}) => api.put(path, data, opts);
export const del = (path, opts = {}) => api.delete(path, opts);

const LostList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await get('/api/report-lost');
        if (res && res.status === 200) setItems(res.data || []);
        else setItems([]);
      } catch (err) {
        console.error('Load lost items', err);
        setItems([]);
      }
    };
    load();
  }, []);

  return (
    <div>
      <h1>Lost Items</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default LostList;