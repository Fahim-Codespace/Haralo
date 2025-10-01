import React, { useEffect, useState } from 'react';
import { get } from '../utils/requests';

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