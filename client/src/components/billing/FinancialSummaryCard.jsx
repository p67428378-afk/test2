import React from 'react';

export default function FinancialSummaryCard({ invoices = [] }) {
  const totalBilled = invoices.reduce((sum, inv) => sum + Number(invoiceAmount(inv.total_amount)), 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + Number(invoiceAmount(inv.paid_amount)), 0);
  const totalOutstanding = totalBilled - totalPaid;

  function invoiceAmount(val) {
    return val || 0;
  }

  return (
    <div className="bg-surface-container p-6 rounded-xl border border-outline-variant">
      <h3 className="font-headline-md text-headline-md mb-4">Financial Summary</h3>
      <div className="space-y-4">
        <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant flex justify-between items-center">
          <div>
            <span className="text-xs text-on-surface-variant uppercase tracking-wider">Total Billed</span>
            <p className="text-2xl font-bold mt-1 text-on-surface">${totalBilled.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <span className="material-symbols-outlined text-3xl text-primary">receipt_long</span>
        </div>
        <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant flex justify-between items-center">
          <div>
            <span className="text-xs text-on-surface-variant uppercase tracking-wider">Total Collected</span>
            <p className="text-2xl font-bold mt-1 text-tertiary">${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <span className="material-symbols-outlined text-3xl text-tertiary">payments</span>
        </div>
        <div className="p-4 bg-surface-container-low rounded-lg border border-outline-variant flex justify-between items-center">
          <div>
            <span className="text-xs text-on-surface-variant uppercase tracking-wider">Outstanding Balance</span>
            <p className="text-2xl font-bold mt-1 text-error">${totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </div>
          <span className="material-symbols-outlined text-3xl text-error">pending_actions</span>
        </div>
      </div>
    </div>
  );
}