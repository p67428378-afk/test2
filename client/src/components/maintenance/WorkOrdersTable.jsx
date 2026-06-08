import React from 'react';

export default function WorkOrdersTable({ orders = [], onUpdateStatus }) {
  return (
    <section className='bento-card rounded-lg flex flex-col'>
      <div className='p-md border-b border-outline-variant flex justify-between items-center'>
        <h3 className='font-title-sm text-title-sm text-on-surface'>Maintenance Work Orders</h3>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-left'>
          <thead className='bg-surface-container-low'>
            <tr>
              <th className='px-md py-sm font-label-mono text-label-mono text-on-surface-variant'>Order ID</th>
              <th className='px-md py-sm font-label-mono text-label-mono text-on-surface-variant'>Description</th>
              <th className='px-md py-sm font-label-mono text-label-mono text-on-surface-variant'>Assigned To</th>
              <th className='px-md py-sm font-label-mono text-label-mono text-on-surface-variant'>Priority</th>
              <th className='px-md py-sm font-label-mono text-label-mono text-on-surface-variant'>Due Date</th>
              <th className='px-md py-sm font-label-mono text-label-mono text-on-surface-variant'>Status</th>
              <th className='px-md py-sm font-label-mono text-label-mono text-on-surface-variant text-right'>Action</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-outline-variant/30'>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className='hover:bg-surface-container-low/30 transition-colors h-[40px]'>
                  <td className='px-md py-sm font-label-mono text-body-sm text-on-surface'>{order.id.substring(0, 8)}</td>
                  <td className='px-md py-sm font-body-sm text-on-surface'>{order.description}</td>
                  <td className='px-md py-sm font-body-sm text-on-surface'>{order.assigned_to}</td>
                  <td className='px-md py-sm'>
                    <span className={`inline-flex items-center gap-xs px-sm py-xs rounded text-[10px] font-bold uppercase ${
                      order.priority === 'high'
                        ? 'bg-error-container text-on-error-container'
                        : order.priority === 'medium'
                        ? 'bg-tertiary-container text-on-tertiary-container'
                        : 'bg-secondary-container text-on-secondary-container'
                    }`}>
                      {order.priority}
                    </span>
                  </td>
                  <td className='px-md py-sm font-label-mono text-body-sm text-on-surface'>
                    {new Date(order.due_date).toLocaleDateString()}
                  </td>
                  <td className='px-md py-sm font-body-sm text-on-surface capitalize'>{order.status}</td>
                  <td className='px-md py-sm text-right space-x-sm'>
                    {order.status === 'pending' && (
                      <button
                        onClick={() => onUpdateStatus && onUpdateStatus(order.id, 'in_progress')}
                        className='bg-primary text-on-primary px-sm py-xs rounded text-[10px] font-bold hover:opacity-90 transition-all active:scale-95'
                      >
                        Start Work
                      </button>
                    )}
                    {order.status === 'in_progress' && (
                      <button
                        onClick={() => onUpdateStatus && onUpdateStatus(order.id, 'completed')}
                        className='bg-green-500 text-white px-sm py-xs rounded text-[10px] font-bold hover:opacity-90 transition-all active:scale-95'
                      >
                        Complete
                      </button>
                    )}
                    {order.status === 'completed' && (
                      <span className='text-green-500 font-semibold text-body-sm'>Done</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='7' className='px-md py-lg text-center text-on-surface-variant italic'>
                  No maintenance work orders scheduled.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
