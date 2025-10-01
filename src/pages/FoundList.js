import { get } from '../utils/requests';
import { useEffect, useState } from 'react';

const YourComponent = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await get('/api/report-found');
        if (res && res.status === 200) setItems(res.data || []);
        else setItems([]);
      } catch (err) { console.error('Load found items', err); setItems([]); }
    };
    load();
  }, []);

  return (
    <div>
      {/* Render your items here */}
    </div>
  );
};

export default YourComponent;