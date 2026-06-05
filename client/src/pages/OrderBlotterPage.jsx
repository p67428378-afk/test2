import React, { useState, useEffect } from 'react';
import OrderBlotterTable from '../components/orders/OrderBlotterTable';
import { getOrder } from '../services/api'; // Assuming you have a function to get all orders

// Mock data until API is fully integrated
const mockOrders = [
    { order_id: 'ORD-001', instrument_id: 'AAPL', quantity: 100, price: 175.50, order_type: 'LIMIT', status: 'FILLED', updated_at: '2023-10-27T10:30:00Z' },
    { order_id: 'ORD-002', instrument_id: 'MSFT', quantity: 200, price: 320.10, order_type: 'MARKET', status: 'PARTIALLY_FILLED', updated_at: '2023-10-27T10:31:15Z' },
    { order_id: 'ORD-003', instrument_id: 'GOOG', quantity: 50, price: 1400.00, order_type: 'LIMIT', status: 'PENDING', updated_at: '2023-10-27T10:32:30Z' },
    { order_id: 'ORD-004', instrument_id: 'AMZN', quantity: 75, price: 130.00, order_type: 'LIMIT', status: 'CANCELED', updated_at: '2023-10-27T10:33:00Z' },
];

const OrderBlotterPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Replace with actual API call, e.g., getAllOrders()
        // For now, we use mock data.
        // const fetchedOrders = await getAllOrders(); 
        setOrders(mockOrders);
      } catch (err) {
        setError('Failed to fetch orders.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className='text-center p-8'>Loading orders...</div>;
  }

  if (error) {
    return <div className='text-center p-8 text-error'>{error}</div>;
  }

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Order Blotter</h2>
      <OrderBlotterTable orders={orders} />
    </div>
  );
};

export default OrderBlotterPage;
