import React, { useState } from "react";
import InvoiceTable from "../components/billing/InvoiceTable";
import InvoiceForm from "../components/billing/InvoiceForm";

export default function BillingPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleInvoiceCreated = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Billing & Invoicing Management
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Issue itemized invoices and manage consultation payment statuses
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <InvoiceTable refreshTrigger={refreshKey} />
        </div>
        <div className="lg:col-span-2">
          <InvoiceForm onInvoiceCreated={handleInvoiceCreated} />
        </div>
      </div>
    </div>
  );
}
