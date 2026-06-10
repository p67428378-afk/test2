import React, { useState } from 'react';
import InvoicesListTable from '../components/billing/InvoicesListTable';
import FinancialSummaryCard from '../components/billing/FinancialSummaryCard';
import InvoiceDetailsCard from '../components/billing/InvoiceDetailsCard';

export default function BillingInvoicingPage({ invoices, onCreateClick, onUpdateStatus }) {
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  return (
    <div>
      <div className="mb-10">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">Billing &amp; Invoicing</h2>
        <p className="text-on-surface-variant font-body-md">Generate itemized invoices and track payment statuses for funeral arrangements.</p>
      </div>

      <div className="grid grid-cols-12 gap-gutter">
        <div className="col-span-12 xl:col-span-8">
          <InvoicesListTable
            invoices={invoices}
            onCreateClick={onCreateClick}
            onUpdateStatus={onUpdateStatus}
            onViewDetails={(invoice) => setSelectedInvoice(invoice)}
          />
        </div>
        <div className="col-span-12 xl:col-span-4 space-y-6">
          <FinancialSummaryCard invoices={invoices} />
          <InvoiceDetailsCard
            invoice={selectedInvoice}
            onClose={() => setSelectedInvoice(null)}
          />
        </div>
      </div>
    </div>
  );
}