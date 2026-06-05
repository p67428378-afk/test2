import React, { useState, useEffect } from 'react';
import OrderBlotterTable from '../components/orders/OrderBlotterTable';
import { getOrder } from '../services/api'; // Assuming an API function to get all orders

const OrderBlotterPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // This is a mock implementation. In a real scenario, you would fetch all orders.
        // Since there is no endpoint for all orders, we will mock it.
        const mockOrders = [
            { order_id: 'ORD-001', instrument_id: 'AAPL', quantity: 100, price: 175.50, order_type: 'LIMIT', status: 'FILLED', filled_percent: 100, updated_at: new Date().toISOString() },
            { order_id: 'ORD-002', instrument_id: 'MSFT', quantity: 200, price: 320.10, order_type: 'MARKET', status: 'PARTIALLY_FILLED', filled_percent: 50, updated_at: new Date().toISOString() },
            { order_id: 'ORD-003', instrument_id: 'GOOG', quantity: 50, price: 1400.00, order_type: 'LIMIT', status: 'PENDING', filled_percent: 0, updated_at: new Date().toISOString() },
            { order_id: 'ORD-004', instrument_id: 'AMZN', quantity: 20, price: 185.00, order_type: 'LIMIT', status: 'CANCELED', filled_percent: 0, updated_at: new Date().toISOString() },
        ];
        setOrders(mockOrders);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders.');
        setLoading(false);
        console.error(err);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div className="text-error">{error}</div>;
  }

  return (
    <div>
      <OrderBlotterTable orders={orders} />
    </div>
  );
};

export default OrderBlotterPage;
