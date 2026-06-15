import React from 'react';

const StatusBadge = ({ status }) => {
    let colorClasses;
    switch (status.toLowerCase()) {
        case 'filled':
            colorClasses = 'bg-tertiary-fixed/30 text-tertiary';
            break;
        case 'partially_filled':
            colorClasses = 'bg-primary-fixed/30 text-primary';
            break;
        case 'pending':
            colorClasses = 'bg-secondary-container text-on-secondary-container';
            break;
        case 'canceled':
        case 'rejected':
            colorClasses = 'bg-error-container text-on-error-container';
            break;
        default:
            colorClasses = 'bg-surface-container-high text-on-surface-variant';
    }
    return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${colorClasses}`}>{status.replace('_', ' ')}</span>;
};

const OrderBlotterTable = ({ orders }) => {
  return (
    <div className='bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full text-left'>
          <thead className='bg-surface-container-low border-b border-outline-variant'>
            <tr>
              <th className='px-4 py-3 font-label-caps text-xs text-on-surface-variant'>Order ID</th>
              <th className='px-4 py-3 font-label-caps text-xs text-on-surface-variant'>Instrument</th>
              <th className='px-4 py-3 font-label-caps text-xs text-on-surface-variant'>Qty</th>
              <th className='px-4 py-3 font-label-caps text-xs text-on-surface-variant'>Price</th>
              <th className='px-4 py-3 font-label-caps text-xs text-on-surface-variant'>Type</th>
              <th className='px-4 py-3 font-label-caps text-xs text-on-surface-variant'>Status</th>
              <th className='px-4 py-3 font-label-caps text-xs text-on-surface-variant'>Updated</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-outline-variant/30'>
            {orders.map((order) => (
              <tr key={order.order_id} className='hover:bg-primary/5 transition-colors'>
                <td className='px-4 py-3 font-data-tabular text-sm'>{order.order_id}</td>
                <td className='px-4 py-3 font-bold text-on-surface'>{order.instrument_id}</td>
                <td className='px-4 py-3 font-data-tabular text-sm'>{order.quantity}</td>
                <td className='px-4 py-3 font-data-tabular text-sm'>${order.price.toFixed(2)}</td>
                <td className='px-4 py-3 text-xs font-semibold text-on-surface-variant'>{order.order_type}</td>
                <td className='px-4 py-3'><StatusBadge status={order.status} /></td>
                <td className='px-4 py-3 font-data-tabular text-sm text-on-surface-variant'>{new Date(order.updated_at).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderBlotterTable;
