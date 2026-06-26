import React, { useState } from "react";

export default function InvoiceTable({
  invoices,
  patients,
  onProcessPayment,
  onSubmitClaim,
}) {
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const getPatientName = (patientId) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? patient.name : "Unknown Patient";
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-800 border border-green-200";
      case "partially_paid":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "claim_pending":
        return "bg-secondary-fixed text-primary-fixed border border-secondary-fixed-dim";
      case "unpaid":
      default:
        return "bg-error-container text-error border border-error/20";
    }
  };

  const handleOpenPaymentModal = (invoice) => {
    setSelectedInvoice(invoice);
    setPaymentAmount(invoice.total_amount);
    setError("");
    setSuccess("");
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await onProcessPayment({
        invoice_id: selectedInvoice.id,
        amount: paymentAmount,
        payment_method: paymentMethod,
      });
      setSuccess("Payment processed successfully!");
      setTimeout(() => {
        setSelectedInvoice(null);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to process payment.");
    } finally {
      setLoading(false);
    }
  };

  const handleClaimSubmit = async (invoiceId) => {
    try {
      await onSubmitClaim(invoiceId);
      alert("Insurance claim submitted successfully!");
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to submit insurance claim.");
    }
  };

  return (
    <div className="bg-surface-container-lowest rounded-lg border border-outline-variant overflow-hidden shadow-sm">
      <div className="p-4 border-b border-outline-variant bg-surface-container-lowest">
        <h3 className="font-headline-sm text-headline-sm text-on-surface">
          Invoices & Billing
        </h3>
        <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
          Track payments and submit insurance claims
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase">
                Invoice ID
              </th>
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase">
                Patient
              </th>
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase">
                Billing Code
              </th>
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase">
                Total Amount
              </th>
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase">
                Status
              </th>
              <th className="py-3 px-4 font-label-md text-label-md text-on-surface-variant uppercase text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="font-body-md text-body-md text-on-surface divide-y divide-outline-variant/50">
            {invoices.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="py-8 text-center text-on-surface-variant"
                >
                  No invoices found. Generate a new invoice to get started.
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr
                  key={invoice.id}
                  className="hover:bg-surface-container-low transition-colors h-[56px] group"
                >
                  <td
                    className="py-3 px-4 font-medium truncate max-w-[120px]"
                    title={invoice.id}
                  >
                    {invoice.id}
                  </td>
                  <td className="py-3 px-4 font-semibold">
                    {getPatientName(invoice.patient_id)}
                  </td>
                  <td className="py-3 px-4">{invoice.billing_code}</td>
                  <td className="py-3 px-4 font-bold">
                    ${invoice.total_amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(invoice.status)}`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    {invoice.status !== "paid" && (
                      <>
                        <button
                          onClick={() => handleOpenPaymentModal(invoice)}
                          className="text-primary hover:text-primary-container font-semibold text-sm"
                        >
                          Pay
                        </button>
                        <button
                          onClick={() => handleClaimSubmit(invoice.id)}
                          className="text-secondary hover:text-on-secondary-fixed-variant font-semibold text-sm"
                        >
                          Claim Insurance
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Payment Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-6 max-w-md w-full shadow-xl m-4">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-4">
              Process Payment
            </h3>

            {error && (
              <div
                className="mb-4 p-3 bg-error-container text-error rounded-lg text-sm font-medium"
                role="alert"
              >
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-800 border border-green-200 rounded-lg text-sm font-medium">
                {success}
              </div>
            )}

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <p className="text-sm text-on-surface-variant">
                  Invoice ID: {selectedInvoice.id}
                </p>
                <p className="text-sm text-on-surface-variant">
                  Patient: {getPatientName(selectedInvoice.patient_id)}
                </p>
                <p className="text-lg font-bold text-on-surface mt-2">
                  Total Due: ${selectedInvoice.total_amount.toFixed(2)}
                </p>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-on-surface-variant mb-1"
                  htmlFor="payment_method"
                >
                  Payment Method
                </label>
                <select
                  id="payment_method"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                >
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Insurance">Insurance</option>
                </select>
              </div>

              <div>
                <label
                  className="block text-sm font-medium text-on-surface-variant mb-1"
                  htmlFor="payment_amount"
                >
                  Payment Amount ($)
                </label>
                <input
                  type="number"
                  id="payment_amount"
                  min="0.01"
                  step="0.01"
                  max={selectedInvoice.total_amount}
                  value={paymentAmount}
                  onChange={(e) =>
                    setPaymentAmount(parseFloat(e.target.value) || 0)
                  }
                  className="w-full p-2 rounded-lg border border-outline-variant bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedInvoice(null)}
                  className="px-4 py-2 border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container-high transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold hover:bg-primary-container transition-colors disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Submit Payment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
