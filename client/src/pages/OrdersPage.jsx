import React, { useState, useEffect } from 'react';
import { getQuotes, getOrders } from '../services/api.js';
import QuotingCalculator from '../components/orders/QuotingCalculator.jsx';
import OrdersTable from '../components/orders/OrdersTable.jsx';

export default function OrdersPage() {
  const [quotes, setQuotes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [quotesData, ordersData] = await Promise.all([
        getQuotes(),
        getOrders()
      ]);
      setQuotes(quotesData);
      setOrders(ordersData);
    } catch (err) {
      console.error('Error fetching orders page data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-brand-indigo font-semibold">Loading quotes &amp; orders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-on-surface">Quotes &amp; Orders Management</h1>
        <p className="text-sm text-on-surface-variant mt-1">Create quotes, convert to orders, and track production status.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <QuotingCalculator onQuoteCreated={fetchData} />
        </div>
        <div className="lg:col-span-2">
          <OrdersTable quotes={quotes} orders={orders} onRefresh={fetchData} />
        </div>
      </div>
    </div>
  );
}