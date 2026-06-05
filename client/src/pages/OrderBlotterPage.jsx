import React, { useState, useEffect } from 'react';
import OrderBlotterTable from '../components/orders/OrderBlotterTable';
import { getOrders } from '../services/api'; // Assuming an endpoint to get all orders

const OrderBlotterPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // This is a mock implementation. In a real app, you would fetch all orders.
        // const response = await getOrders(); 
        // setOrders(response.data);
        setOrders([
            { order_id: 'ORD-001', instrument_id: 'AAPL', quantity: 100, price: 175.50, order_type: 'LIMIT', status: 'FILLED', filled_percent: 100, updated_at: new Date().toISOString() },
            { order_id: 'ORD-002', instrument_id: 'MSFT', quantity: 200, price: 320.10, order_type: 'MARKET', status: 'PARTIALLY_FILLED', filled_percent: 50, updated_at: new Date().toISOString() },
            { order_id: 'ORD-003', instrument_id: 'GOOG', quantity: 50, price: 1400.00, order_type: 'LIMIT', status: 'PENDING', filled_percent: 0, updated_at: new Date().toISOString() },
            { order_id: 'ORD-004', instrument_id: 'AMZN', quantity: 75, price: 185.25, order_type: 'LIMIT', status: 'CANCELED', filled_percent: 0, updated_at: new Date().toISOString() },
        ]);
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
    return <div className="text-center p-8">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-error">{error}</div>;
  }

  return (
    <div>
      <OrderBlotterTable orders={orders} title="Full Order Blotter" />
    </div>
  );
};

export default OrderBlotterPage;
