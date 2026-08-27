import React, { useState } from "react";
import {
  Download,
  Search,
  FileText,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { donationsAPI } from "../../services/api";

export default function DonationAuditLedgerTable({
  donations,
  total,
  skip,
  limit,
  onPageChange,
  onFilterChange,
}) {
  const [donorNameFilter, setDonorNameFilter] = useState("");
  const [exporting, setExporting] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onFilterChange) {
      onFilterChange({ donor_name: donorNameFilter });
    }
  };

  const handleExportCSV = async () => {
    setExporting(true);
    try {
      const data = await donationsAPI.getDonations({
        export_csv: true,
        donor_name: donorNameFilter || undefined,
      });

      // Trigger browser download
      const blob = new Blob([data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `donations_export_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert(
        "Failed to export CSV: " + (err.message || "Error downloading file"),
      );
    } finally {
      setExporting(false);
    }
  };

  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.ceil(total / limit) || 1;

  const formatCurrency = (amt) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(amt || 0);
  };

  const formatDate = (isoStr) => {
    if (!isoStr) return "N/A";
    try {
      return new Date(isoStr).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch (e) {
      return isoStr;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Table Header Controls */}
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Donation Audit Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time ledger of all incoming contributions across campaigns
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          {/* Search Input */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full sm:w-64"
          >
            <input
              type="text"
              placeholder="Filter by donor name..."
              value={donorNameFilter}
              onChange={(e) => setDonorNameFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            disabled={exporting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors shadow-sm disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{exporting ? "Exporting..." : "Export CSV"}</span>
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-200 font-semibold text-slate-500 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Transaction ID</th>
              <th className="px-6 py-4">Donor Name & Email</th>
              <th className="px-6 py-4">Campaign</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Payment Status</th>
              <th className="px-6 py-4">Timestamp (UTC)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {donations.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-12 text-center text-slate-400"
                >
                  No donation records found.
                </td>
              </tr>
            ) : (
              donations.map((d) => (
                <tr
                  key={d.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="px-6 py-4 font-mono font-semibold text-slate-900">
                    {d.transaction_id || d.id.substring(0, 8)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">
                      {d.donor_name}
                    </div>
                    <div className="text-slate-400">{d.donor_email}</div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {d.campaign_title || "General Campaign"}
                  </td>
                  <td className="px-6 py-4 font-bold text-emerald-600">
                    {formatCurrency(d.amount)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200 uppercase">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{d.payment_status || "Completed"}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {formatDate(d.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
        <div>
          Showing {donations.length > 0 ? skip + 1 : 0} to{" "}
          {Math.min(skip + limit, total)} of {total} records
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage <= 1}
            onClick={() => onPageChange && onPageChange(skip - limit)}
            className="p-1 rounded border border-slate-200 hover:bg-white disabled:opacity-30"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-medium text-slate-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange && onPageChange(skip + limit)}
            className="p-1 rounded border border-slate-200 hover:bg-white disabled:opacity-30"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
