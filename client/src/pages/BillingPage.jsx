import React from "react";
import CreateInvoiceForm from "../components/billing/CreateInvoiceForm";
import InvoiceTable from "../components/billing/InvoiceTable";

export default function BillingPage({
  patients,
  appointments,
  invoices,
  onCreateInvoice,
  onProcessPayment,
  onSubmitClaim,
}) {
  return (
    <div className="space-y-section-gap">
      <div>
        <h2 className="font-display-lg text-display-lg text-on-surface font-bold">
          Billing &amp; Invoices
        </h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
          Automate billing, generate invoices, process payments, and manage
          insurance claims.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-grid-gutter">
        <div className="lg:col-span-2">
          <InvoiceTable
            invoices={invoices}
            patients={patients}
            onProcessPayment={onProcessPayment}
            onSubmitClaim={onSubmitClaim}
          />
        </div>

        <div>
          <CreateInvoiceForm
            patients={patients}
            appointments={appointments}
            onCreateInvoice={onCreateInvoice}
          />
        </div>
      </div>
    </div>
  );
}
