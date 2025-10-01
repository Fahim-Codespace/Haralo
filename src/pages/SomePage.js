import { useEffect, useState } from 'react';
import { get } from '../utils/requests';

export default function ReportFound() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await get('/api/report-found'); // hits https://pacchina-backend.onrender.com/api/report-found in production
        setItems(res.data);
      } catch (err) {
        console.error('Failed to load items', err);
      }
    }
    load();
  }, []);

  return (
    <div>
      <h1>Report Found Items</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}