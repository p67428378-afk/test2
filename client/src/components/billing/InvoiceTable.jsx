import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Filter,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { getInvoices, updateInvoicePaymentStatus } from "../../services/api";

export default function InvoiceTable({ refreshTrigger }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");

  const fetchInvoicesList = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filterStatus) params.payment_status = filterStatus;
      const data = await getInvoices(params);
      setInvoices(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Failed to fetch invoices list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoicesList();
  }, [filterStatus, refreshTrigger]);

  const handlePaymentStatusChange = async (invoiceId, newStatus) => {
    try {
      await updateInvoicePaymentStatus(invoiceId, newStatus);
      fetchInvoicesList();
    } catch (err) {
      alert(
        "Failed to update payment status: " +
          (err.response?.data?.detail || err.message),
      );
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <CreditCard className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              Billing Invoices Directory
            </h2>
            <p className="text-xs text-slate-500">
              Track consultation & treatment payments
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
            >
              <option value="">All Payment Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>

          <button
            onClick={fetchInvoicesList}
            disabled={loading}
            className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            title="Refresh Invoices"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 mb-4 bg-red-50 text-red-700 text-xs rounded-lg">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <th className="py-2.5 px-3">Invoice ID</th>
              <th className="py-2.5 px-3">Appointment ID</th>
              <th className="py-2.5 px-3">Patient ID</th>
              <th className="py-2.5 px-3">Total Amount</th>
              <th className="py-2.5 px-3">Payment Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-slate-400">
                  Loading invoices...
                </td>
              </tr>
            ) : invoices.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-slate-400">
                  No invoices found.
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-2.5 px-3 font-mono text-slate-500 font-medium">
                    {inv.id.slice(0, 8)}...
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">
                    {inv.appointment_id.slice(0, 8)}...
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">
                    {inv.patient_id.slice(0, 8)}...
                  </td>
                  <td className="py-2.5 px-3 font-bold text-slate-800">
                    ${Number(inv.total_amount).toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        inv.payment_status === "Paid"
                          ? "bg-emerald-100 text-emerald-700"
                          : inv.payment_status === "Pending"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {inv.payment_status === "Paid" ? (
                        <CheckCircle className="h-3 w-3" />
                      ) : inv.payment_status === "Pending" ? (
                        <Clock className="h-3 w-3" />
                      ) : (
                        <AlertTriangle className="h-3 w-3" />
                      )}
                      {inv.payment_status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <select
                      value={inv.payment_status}
                      onChange={(e) =>
                        handlePaymentStatusChange(inv.id, e.target.value)
                      }
                      className="text-xs border border-slate-200 rounded px-2 py-1 bg-white font-medium text-slate-700 focus:outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Refunded">Refunded</option>
                    </select>
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
