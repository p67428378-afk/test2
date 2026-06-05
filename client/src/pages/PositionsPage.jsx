import React, { useState, useEffect } from 'react';
import PositionsTable from '../components/positions/PositionsTable';
import { getPositions } from '../services/api';

// Mock data until API is fully integrated
const mockPositions = [
    { instrument_id: 'AAPL', quantity: 500, average_price: 170.00 },
    { instrument_id: 'TSLA', quantity: 100, average_price: 250.00 },
    { instrument_id: 'NVDA', quantity: 250, average_price: 450.75 },
];

const PositionsPage = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        // Replace with actual API call, e.g., getPositions(traderId)
        // const fetchedPositions = await getPositions('some-trader-id');
        setPositions(mockPositions);
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
    return <div className='text-center p-8'>Loading positions...</div>;
  }

  if (error) {
    return <div className='text-center p-8 text-error'>{error}</div>;
  }

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Current Positions</h2>
      <PositionsTable positions={positions} />
    </div>
  );
};

export default PositionsPage;
