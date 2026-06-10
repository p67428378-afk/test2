import React from 'react';

export default function InvoiceDetailsCard({ invoice, onClose }) {
  if (!invoice) {
    return (
      <div className="bg-surface-container p-6 rounded-xl border border-outline-variant text-center text-on-surface-variant">
        Select an invoice to view itemized details.
      </div>
    );
  }

  const items = invoice.items || [
    { description: 'Standard Funeral Service Package', amount: 4500.00 },
    { description: 'Casket - Oak Classic', amount: 2500.00 },
    { description: 'Cemetery Plot & Burial Fees', amount: 3500.00 },
    { description: 'Transportation & Hearse Service', amount: 850.00 },
  ];

  const total = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return (
    <div className="bg-surface-container p-6 rounded-xl border border-outline-variant relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-headline-md text-headline-md">Invoice Details</h3>
        <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface bg-transparent border-none cursor-pointer">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-on-surface-variant">Invoice ID:</span>
          <span className="font-mono font-bold">#{invoice.invoice_id ? invoice.invoice_id.substring(0, 8).toUpperCase() : 'N/A'}</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-on-surface-variant">Funeral ID:</span>
          <span className="font-mono">#{invoice.funeral_id ? invoice.funeral_id.substring(0, 8).toUpperCase() : 'N/A'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-on-surface-variant">Status:</span>
          <span className="font-bold uppercase text-xs text-primary">{invoice.status || 'Unpaid'}</span>
        </div>
      </div>
      <div className="border-t border-outline-variant pt-4 mb-6">
        <h4 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-3">Itemized Charges</h4>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-on-surface">{item.description}</span>
              <span className="font-medium">${Number(item.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-outline-variant pt-4">
        <div className="flex justify-between text-base font-bold mb-2">
          <span>Total Amount:</span>
          <span>${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between text-sm text-tertiary mb-4">
          <span>Amount Paid:</span>
          <span>-${Number(invoice.paid_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between text-base font-bold text-error border-t border-dashed border-outline-variant pt-3">
          <span>Balance Due:</span>
          <span>${(total - Number(invoice.paid_amount || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      </div>
    </div>
  );
}