import React from 'react';

export default function WarningBanner({ orders = [] }) {
  // Find if there is any high-priority task that is overdue (due date in the past and status is not completed)
  const now = new Date();
  const overdueHighPriorityOrder = orders.find(
    (order) =>
      order.priority === 'high' &&
      order.status !== 'completed' &&
      new Date(order.due_date) < now
  );

  if (!overdueHighPriorityOrder) return null;

  return (
    <div className='bg-error-container/20 border border-error text-error p-md rounded-lg mb-lg flex items-center gap-md animate-pulse'>
      <span className='material-symbols-outlined text-2xl'>warning</span>
      <div className='flex-1'>
        <h4 className='font-bold text-body-md'>CRITICAL WARNING: Overdue High-Priority Maintenance</h4>
        <p className='text-body-sm text-on-surface-variant'>
          The high-priority maintenance task <strong>"{overdueHighPriorityOrder.description}"</strong> assigned to <strong>{overdueHighPriorityOrder.assigned_to}</strong> was due on {new Date(overdueHighPriorityOrder.due_date).toLocaleDateString()}. Please address this immediately to prevent system failure.
        </p>
      </div>
    </div>
  );
}
