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
        // Assuming traderId is available, e.g., from user context
        const traderId = 'some-trader-id';
        const response = await getPositions(traderId);
        // Add mock data for current_price and pnl for demonstration
        const positionsWithMockData = response.data.map(p => ({
          ...p,
          current_price: p.average_price * (1 + (Math.random() - 0.5) * 0.1), // Simulate price fluctuation
          pnl: (p.average_price * (1 + (Math.random() - 0.5) * 0.1) - p.average_price) * p.quantity,
          updated_at: new Date().toISOString(),
        }));
        setPositions(positionsWithMockData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch positions.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchPositions();
  }, []);

  if (loading) {
    return <div>Loading positions...</div>;
  }

  if (error) {
    return <div className="text-error">{error}</div>;
  }

  return (
    <div>
      <PositionsTable positions={positions} />
    </div>
  );
};

export default PositionsPage;
