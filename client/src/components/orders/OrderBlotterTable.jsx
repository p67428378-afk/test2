import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderBlotterTable = ({ orders, title = 'Order Blotter' }) => {
  const navigate = useNavigate();

  const getStatusChip = (status) => {
    switch (status.toUpperCase()) {
      case 'FILLED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-tertiary-fixed/30 text-tertiary uppercase tracking-wider">FILLED</span>;
      case 'PARTIALLY_FILLED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-container/30 text-primary uppercase tracking-wider">PARTIALLY FILLED</span>;
      case 'PENDING':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary-container text-on-secondary-container uppercase tracking-wider">PENDING</span>;
      case 'CANCELED':
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-error-container text-on-error-container uppercase tracking-wider">CANCELED</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-surface-container-high text-on-surface-variant uppercase tracking-wider">{status}</span>;
    }
  };

  const getFillColor = (status) => {
    if (status.toUpperCase() === 'FILLED') return 'bg-tertiary';
    return 'bg-primary';
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-outline-variant flex justify-between items-center bg-surface-bright">
        <h3 className="font-title-sm text-title-sm text-on-surface">{title}</h3>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-xs border border-outline-variant rounded hover:bg-surface-container-low transition-colors">Export</button>
          <button onClick={() => navigate('/orders/new')} className="px-3 py-1 text-xs bg-primary text-on-primary rounded font-semibold active:scale-95 transition-transform">New Trade</button>
        </div>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left zebra-table">
          <thead className="bg-surface-container-low border-b border-outline-variant sticky top-0 z-10">
            <tr>
              <th className="px-4 py-2 font-label-caps text-label-caps text-on-surface-variant">Order ID</th>
              <th className="px-4 py-2 font-label-caps text-label-caps text-on-surface-variant">Instrument</th>
              <th className="px-4 py-2 font-label-caps text-label-caps text-on-surface-variant">Qty</th>
              <th className="px-4 py-2 font-label-caps text-label-caps text-on-surface-variant">Price</th>
              <th className="px-4 py-2 font-label-caps text-label-caps text-on-surface-variant">Type</th>
              <th className="px-4 py-2 font-label-caps text-label-caps text-on-surface-variant">Status</th>
              <th className="px-4 py-2 font-label-caps text-label-caps text-on-surface-variant">Filled</th>
              <th className="px-4 py-2 font-label-caps text-label-caps text-on-surface-variant">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/30">
            {(orders && orders.length > 0) ? orders.map((order) => (
              <tr key={order.order_id} className="hover:bg-primary/5 transition-colors group">
                <td className="px-4 py-3 font-data-tabular text-data-tabular">{order.order_id}</td>
                <td className="px-4 py-3 font-bold text-on-surface">{order.instrument_id}</td>
                <td className="px-4 py-3 font-data-tabular text-data-tabular">{order.quantity}</td>
                <td className="px-4 py-3 font-data-tabular text-data-tabular">${order.price.toFixed(2)}</td>
                <td className="px-4 py-3 text-xs font-semibold text-on-surface-variant">{order.order_type}</td>
                <td className="px-4 py-3">{getStatusChip(order.status)}</td>
                <td className="px-4 py-3">
                  <div className="w-24 h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div className={`h-full ${getFillColor(order.status)}`} style={{ width: `${order.filled_percent || 0}%` }}></div>
                  </div>
                </td>
                <td className="px-4 py-3 font-data-tabular text-data-tabular text-on-surface-variant">{new Date(order.updated_at).toLocaleTimeString()}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="8" className="text-center py-8 text-on-surface-variant">No orders to display.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderBlotterTable;
