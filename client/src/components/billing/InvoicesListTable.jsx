import React, { useState } from 'react';

export default function InvoicesListTable({ invoices = [], onCreateClick, onUpdateStatus, onViewDetails }) {
  const [statusFilter, setStatusFilter] = useState('');

  const filteredInvoices = invoices.filter((invoice) => {
    return statusFilter ? invoice.status?.toLowerCase() === statusFilter.toLowerCase() : true;
  });

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-tertiary-container/20 text-tertiary border border-tertiary/30';
      case 'partially_paid':
      case 'partially paid':
        return 'bg-primary-container/20 text-primary border border-primary/30';
      case 'unpaid':
        return 'bg-error-container/20 text-error border border-error/30';
      default:
        return 'bg-secondary-container/20 text-secondary border border-secondary/30';
    }
  };

  return (
    <div className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden">
      <div className="px-6 py-5 border-b border-outline-variant flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-headline-md text-headline-md">Invoices &amp; Billing</h3>
          <p className="text-on-surface-variant text-sm mt-1">Generate and track invoices for funeral arrangements.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-1.5 text-sm text-on-surface outline-none focus:border-primary"
          >
            <option value="">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
          <button
            onClick={onCreateClick}
            className="bg-primary-container text-on-primary-container px-4 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition-all"
          >
            Create Invoice
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low">
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Invoice ID</th>
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Funeral ID</th>
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Total Amount</th>
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Paid Amount</th>
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Status</th>
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-on-surface-variant">
                  No invoices found.
                </td>
              </tr>
            ) : (
              filteredInvoices.map((invoice, index) => (
                <tr
                  key={invoice.invoice_id || index}
                  className={`hover:bg-surface-container-high transition-colors ${
                    index % 2 === 1 ? 'bg-surface-container-low/30' : ''
                  }`}
                >
                  <td className="px-6 py-5 font-mono text-xs text-on-surface-variant">
                    #{invoice.invoice_id ? invoice.invoice_id.substring(0, 8).toUpperCase() : `INV-2026-00${index + 1}`}
                  </td>
                  <td className="px-6 py-5 font-mono text-xs text-on-surface-variant">
                    #{invoice.funeral_id ? invoice.funeral_id.substring(0, 8).toUpperCase() : 'N/A'}
                  </td>
                  <td className="px-6 py-5 font-medium">
                    ${Number(invoice.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-5 text-on-surface-variant">
                    ${Number(invoice.paid_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeClass(invoice.status)}`}>
                      {invoice.status || 'Unpaid'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right flex justify-end gap-3">
                    <button
                      onClick={() => onViewDetails(invoice)}
                      className="text-primary hover:text-primary-fixed text-sm font-medium bg-transparent border-none cursor-pointer"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => onUpdateStatus(invoice)}
                      className="text-secondary hover:text-on-surface text-sm font-medium bg-transparent border-none cursor-pointer"
                    >
                      Record Payment
                    </button>
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