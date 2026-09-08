import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Receipt,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { invoicesApi } from "../services/api.js";
import InvoiceFolioCard from "../components/InvoiceFolioCard.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

export default function InvoicesPage() {
  const [searchParams] = useSearchParams();
  const paramResId = searchParams.get("resId");

  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchResId, setSearchResId] = useState(paramResId || "");

  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const fetchInvoices = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = {};
      if (statusFilter) params.payment_status = statusFilter;
      const data = await invoicesApi.getInvoices(params);
      setInvoices(data);

      if (paramResId) {
        const found = data.find((inv) => inv.reservation_id === paramResId);
        if (found) {
          setSelectedInvoice(found);
        } else {
          // Attempt direct lookup
          try {
            const direct =
              await invoicesApi.getInvoiceByReservation(paramResId);
            setSelectedInvoice(direct);
          } catch (e) {
            // Not found
          }
        }
      } else if (data.length > 0 && !selectedInvoice) {
        setSelectedInvoice(data[0]);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load invoices.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [statusFilter, paramResId]);

  const handleLookupByResId = async (e) => {
    e.preventDefault();
    if (!searchResId.trim()) return;
    setError(null);
    try {
      const inv = await invoicesApi.getInvoiceByReservation(searchResId.trim());
      setSelectedInvoice(inv);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          `No invoice found for reservation ID ${searchResId}`,
      );
    }
  };

  const handlePayment = async (paymentData) => {
    if (!selectedInvoice) return;
    setIsPaying(true);
    setError(null);
    try {
      const updated = await invoicesApi.payInvoice(
        selectedInvoice.reservation_id,
        paymentData,
      );
      setSelectedInvoice(updated);
      setSuccessMsg("Payment processed successfully and invoice updated!");
      setTimeout(() => setSuccessMsg(""), 4000);
      await fetchInvoices();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to process payment.");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0b1c30]">
            Billing & Guest Folios
          </h1>
          <p className="text-sm text-slate-500">
            Review itemized room charges, apply promotional discounts, and
            settle invoices.
          </p>
        </div>
        <button
          onClick={fetchInvoices}
          className="p-2 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-lg shadow-sm hover:bg-slate-50 transition self-start sm:self-auto"
          title="Refresh Invoices"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-emerald-800 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filters & Direct Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Payment Status:
          </span>
          {["", "UNPAID", "PARTIAL", "PAID"].map((st) => (
            <button
              key={st || "all"}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                statusFilter === st
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st || "All Invoices"}
            </button>
          ))}
        </div>

        <form
          onSubmit={handleLookupByResId}
          className="flex items-center gap-2 w-full md:w-80"
        >
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Lookup by Reservation UUID..."
              value={searchResId}
              onChange={(e) => setSearchResId(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg hover:bg-slate-900 transition shrink-0"
          >
            Find Folio
          </button>
        </form>
      </div>

      {/* Invoices List + Selected Folio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">
            Invoice Statements ({invoices.length})
          </h3>
          {isLoading ? (
            <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-slate-400 text-sm">
              Loading invoices...
            </div>
          ) : invoices.length === 0 ? (
            <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-slate-400 text-sm">
              No invoices found.
            </div>
          ) : (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInvoice(inv)}
                  className={`p-4 rounded-xl border cursor-pointer transition ${
                    selectedInvoice?.id === inv.id
                      ? "bg-blue-50/70 border-blue-500 shadow-sm"
                      : "bg-white border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">
                      Invoice #{inv.id.slice(0, 8)}
                    </span>
                    <StatusBadge status={inv.payment_status} type="invoice" />
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex justify-between">
                    <span>Res #{inv.reservation_id.slice(0, 8)}</span>
                    <span className="font-bold text-slate-800">
                      ${Number(inv.total_amount).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="lg:col-span-7">
          <InvoiceFolioCard
            invoice={selectedInvoice}
            onPay={handlePayment}
            isPaying={isPaying}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}
