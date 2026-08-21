import React, { useState, useEffect } from "react";
import {
  CreditCard,
  DollarSign,
  ShieldAlert,
  CheckCircle2,
  X,
  Receipt,
} from "lucide-react";
import DataTable from "../components/common/DataTable";
import Button from "../components/common/Button";
import Field from "../components/common/Field";
import Badge from "../components/common/Badge";
import { billingService } from "../services/api";

export default function InvoicesPage({ user }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPayModal, setShowPayModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, [statusFilter]);

  const fetchInvoices = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await billingService.getInvoices("", statusFilter, 0, 50);
      setInvoices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch invoices error:", err);
      setError("Failed to load invoice directory.");
    } finally {
      setLoading(false);
    }
  };

  const handlePaySubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!selectedInvoice) return;

    setSubmitting(true);

    try {
      const updated = await billingService.payInvoice(
        selectedInvoice.id,
        selectedInvoice.amount,
        paymentMethod,
      );

      setSuccessMsg(
        `Payment of $${selectedInvoice.amount} processed! Status: ${updated.status || "PAID"}`,
      );
      setShowPayModal(false);
      setSelectedInvoice(null);
      fetchInvoices();
    } catch (err) {
      console.error("Pay invoice error:", err);
      const detail = err.response?.data?.detail || "Payment processing failed.";
      setError(detail);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: "Invoice ID",
      accessor: "id",
      render: (row) => (
        <span className="font-mono text-xs text-[#1485b8] font-bold">
          {row.id ? row.id.slice(0, 8) : "N/A"}
        </span>
      ),
    },
    {
      header: "Patient UUID",
      accessor: "patient_id",
      render: (row) => (
        <span className="font-mono text-xs text-[#171f2e]">
          {row.patient_id ? row.patient_id.slice(0, 8) : "N/A"}
        </span>
      ),
    },
    {
      header: "Amount",
      accessor: "amount",
      render: (row) => (
        <span className="font-bold text-[#171f2e] text-sm">
          ${parseFloat(row.amount).toFixed(2)}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <Badge variant={row.status}>{row.status}</Badge>,
    },
    {
      header: "Created Date",
      accessor: "created_at",
      render: (row) => (
        <span className="text-xs text-[#6b7a8f]">
          {new Date(row.created_at).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "id",
      render: (row) => (
        <div className="flex items-center space-x-2">
          {row.status === "PENDING" ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setSelectedInvoice(row);
                setShowPayModal(true);
              }}
              icon={CreditCard}
            >
              Process Payment
            </Button>
          ) : (
            <span className="text-xs text-[#149e52] font-semibold flex items-center gap-1">
              ✓ Paid
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#171f2e]">
            Billing & Itemized Invoice Management
          </h1>
          <p className="text-xs text-[#6b7a8f]">
            Calculate service charges, generate itemized invoices, and track
            payment status.
          </p>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-[#6b7a8f] font-semibold">
            Filter Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-white border border-[#e0e8f0] rounded-lg text-xs font-medium text-[#171f2e] focus:outline-none focus:ring-2 focus:ring-[#1485b8]"
          >
            <option value="">All Invoices</option>
            <option value="PENDING">PENDING Only</option>
            <option value="PAID">PAID Only</option>
            <option value="REFUNDED">REFUNDED Only</option>
          </select>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-[#db2727] text-xs p-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-[#149e52] text-xs p-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Invoices Table */}
      <DataTable
        columns={columns}
        data={invoices}
        loading={loading}
        searchPlaceholder="Search invoices..."
        emptyMessage="No invoices found."
      />

      {/* Process Payment Settlement Modal */}
      {showPayModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#e0e8f0] shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#e0e8f0] pb-3">
              <h2 className="text-base font-bold text-[#171f2e] flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#1485b8]" />
                <span>Payment Settlement Panel</span>
              </h2>
              <button
                onClick={() => setShowPayModal(false)}
                className="text-[#6b7a8f]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-lg border border-[#e0e8f0] space-y-1.5 text-xs text-[#171f2e]">
              <div className="flex justify-between">
                <span className="text-[#6b7a8f]">Invoice Ref:</span>
                <span className="font-mono font-bold text-[#1485b8]">
                  {selectedInvoice.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6b7a8f]">Appointment Ref:</span>
                <span className="font-mono">
                  {selectedInvoice.appointment_id || "N/A"}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-[#e0e8f0]">
                <span>Total Amount Due:</span>
                <span className="text-[#149e52]">
                  ${parseFloat(selectedInvoice.amount).toFixed(2)}
                </span>
              </div>
            </div>

            <form onSubmit={handlePaySubmit} className="space-y-4">
              <Field
                label="Payment Method"
                id="payment_method"
                type="select"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                options={[
                  { label: "Credit / Debit Card", value: "Credit Card" },
                  { label: "Cash Settlement", value: "Cash" },
                  { label: "Insurance Claim", value: "Insurance" },
                  { label: "Digital Wallet", value: "Digital Wallet" },
                ]}
                required
              />

              <div className="flex justify-end space-x-2 pt-3 border-t border-[#e0e8f0]">
                <Button
                  variant="secondary"
                  onClick={() => setShowPayModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={submitting}>
                  {submitting
                    ? "Processing..."
                    : `Pay $${parseFloat(selectedInvoice.amount).toFixed(2)}`}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
