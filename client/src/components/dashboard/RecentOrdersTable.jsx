import React from 'react';
import Badge from '../common/Badge.jsx';

export default function RecentOrdersTable({ orders = [] }) {
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
      <div className="px-6 py-4 border-b border-outline-variant/30 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-on-surface">Recent Orders &amp; Status</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/30 bg-surface-container-highest/20">
              <th className="py-3 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Order ID</th>
              <th className="py-3 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Customer</th>
              <th className="py-3 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Glass Type</th>
              <th className="py-3 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Dimensions</th>
              <th className="py-3 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">Total Price</th>
              <th className="py-3 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
              <th className="py-3 px-6 text-xs font-semibold text-on-surface-variant uppercase tracking-wider text-right">Date</th>
            </tr>
          </thead>
          <tbody className="text-sm text-on-surface">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-on-surface-variant">
                  No recent orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.order_id} className="border-b border-outline-variant/10 hover:bg-surface-variant/30 transition-colors">
                  <td className="py-3 px-6 font-medium text-brand-indigo">
                    #{order.order_id.substring(0, 8)}
                  </td>
                  <td className="py-3 px-6">{order.customer_name || 'Walk-in Customer'}</td>
                  <td className="py-3 px-6 text-on-surface-variant">{order.glass_type_name || 'Standard Glass'}</td>
                  <td className="py-3 px-6 text-on-surface-variant">
                    {order.width && order.height ? `${order.width}x${order.height} in` : 'Custom'}
                  </td>
                  <td className="py-3 px-6 text-right font-medium">
                    ${parseFloat(order.total_price || 0).toFixed(2)}
                  </td>
                  <td className="py-3 px-6">
                    <Badge variant={getStatusVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-6 text-right text-on-surface-variant text-xs">
                    {new Date(order.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}