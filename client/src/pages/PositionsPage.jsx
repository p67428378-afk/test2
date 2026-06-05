import React, { useState, useEffect } from 'react';
import PositionsTable from '../components/positions/PositionsTable';
import { getPositions } from '../services/api';

const PositionsPage = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const traderId = 'some-trader-id'; // Mock traderId
        const response = await getPositions(traderId);
        if (response && response.data) {
            const positionsWithMockData = response.data.map(p => ({
              ...p,
              current_price: p.average_price * (1 + (Math.random() - 0.5) * 0.1),
              pnl: (p.average_price * (1 + (Math.random() - 0.5) * 0.1) - p.average_price) * p.quantity,
              updated_at: new Date().toISOString(),
            }));
            setPositions(positionsWithMockData);
        }
      } catch (err) {
        setError('Failed to fetch positions.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPositions();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading positions...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-error">{error}</div>;
  }

  return (
    <div>
      <PositionsTable positions={positions} />
    </div>
  );
};

export default PositionsPage;
