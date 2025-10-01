import { get } from '../utils/requests';
import { useEffect, useState } from 'react';

const LostItems = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await get('/api/report-lost');
        if (res && res.status === 200) setItems(res.data || []);
        else setItems([]);
      } catch (err) { console.error('Load lost items', err); setItems([]); }
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

export default LostItems;