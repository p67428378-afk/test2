import React, { useState } from 'react';
import Badge from '../common/Badge.jsx';
import Button from '../common/Button.jsx';
import { convertQuoteToOrder, updateOrderStatus } from '../../services/api.js';

export default function OrdersTable({ quotes = [], orders = [], onRefresh }) {
  const [activeSubTab, setActiveSubTab] = useState('quotes');
  const [loadingId, setLoadingId] = useState(null);

  const handleConvert = async (quoteId) => {
    setLoadingId(quoteId);
    try {
      await convertQuoteToOrder(quoteId);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to convert quote to order.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setLoadingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
      if (onRefresh) onRefresh();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update order status.');
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'shipped':
        return 'success';
      case 'in production':
        return 'primary';
      case 'pending':
        return 'info';
      case 'cancelled':
        return 'danger';
      default:
        return 'info';
    }
  };

  return (
    <div className="glass-panel rounded-xl overflow-hidden flex flex-col">
      <div className="px-6 py-4 border-b border-outline-variant/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSubTab('quotes')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeSubTab === 'quotes'
                ? 'bg-brand-indigo text-white'
                : 'text-on-surface-variant hover:bg-surface-variant'
            }`}
          >
            Quotes ({quotes.length})
          </button>
          <button
            onClick={() => setActiveSubTab('orders')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeSubTab === 'orders'
                ? 'bg-brand-indigo text-white'
                : 'text-on-surface-variant hover:bg-surface-variant'
            }`}
          >
            Sales Orders ({orders.length})
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {activeSubTab === 'quotes' ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-highest/20">
                <th className="py-3 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Quote ID</th>
                <th className="py-3 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Customer</th>
                <th className="py-3 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Glass Type</th>
                <th className="py-3 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Dimensions</th>
                <th className="py-3 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">Total Price</th>
                <th className="py-3 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="py-3 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-on-surface">
              {quotes.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-on-surface-variant">
                    No quotes found.
                  </td>
                </tr>
              ) : (
                quotes.map((quote) => (
                  <tr key={quote.quote_id} className="border-b border-outline-variant/10 hover:bg-surface-variant/30 transition-colors">
                    <td className="py-3 px-6 font-medium text-brand-indigo">
                      #{quote.quote_id.substring(0, 8)}
                    </td>
                    <td className="py-3 px-6">{quote.customer_name || 'Walk-in Customer'}</td>
                    <td className="py-3 px-6 text-on-surface-variant">{quote.glass_type_name || 'Standard Glass'}</td>
                    <td className="py-3 px-6 text-on-surface-variant">
                      {quote.width}x{quote.height} in
                    </td>
                    <td className="py-3 px-6 text-right font-medium">
                      ${parseFloat(quote.total_price || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-6">
                      <Badge variant="info">{quote.status}</Badge>
                    </td>
                    <td className="py-3 px-6 text-right">
                      {quote.status?.toLowerCase() === 'draft' && (
                        <Button
                          onClick={() => handleConvert(quote.quote_id)}
                          disabled={loadingId === quote.quote_id}
                          variant="success"
                          className="text-xs py-1 px-2"
                        >
                          Convert to Order
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/30 bg-surface-container-highest/20">
                <th className="py-3 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Order ID</th>
                <th className="py-3 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Customer</th>
                <th className="py-3 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Total Price</th>
                <th className="py-3 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
                <th className="py-3 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Update Status</th>
              </tr>
            </thead>
            <tbody className="text-sm text-on-surface">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-on-surface-variant">
                    No sales orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.order_id} className="border-b border-outline-variant/10 hover:bg-surface-variant/30 transition-colors">
                    <td className="py-3 px-6 font-medium text-brand-indigo">
                      #{order.order_id.substring(0, 8)}
                    </td>
                    <td className="py-3 px-6">{order.customer_name || 'Walk-in Customer'}</td>
                    <td className="py-3 px-6 font-medium">
                      ${parseFloat(order.total_price || 0).toFixed(2)}
                    </td>
                    <td className="py-3 px-6">
                      <Badge variant={getStatusVariant(order.status)}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-6">
                      <select
                        value={order.status}
                        disabled={loadingId === order.order_id}
                        onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                        className="bg-[#0F172A] border border-outline-variant/50 text-on-surface text-xs rounded p-1 focus:outline-none focus:border-brand-indigo"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Production">In Production</option>
                        <option value="Completed">Completed</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}