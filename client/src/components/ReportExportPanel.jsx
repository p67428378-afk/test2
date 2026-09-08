import React, { useState } from "react";
import {
  FileSpreadsheet,
  FileText,
  Download,
  Calendar,
  Loader2,
} from "lucide-react";
import { reportApi } from "../services/api";

export default function ReportExportPanel({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) {
  const [exportingCsv, setExportingCsv] = useState(false);
  const [exportingPdf, setExportingPdf] = useState(false);
  const [exportError, setExportError] = useState("");
  const [exportSuccess, setExportSuccess] = useState("");

  const handleExport = async (format) => {
    setExportError("");
    setExportSuccess("");
    if (format === "csv") setExportingCsv(true);
    if (format === "pdf") setExportingPdf(true);

    try {
      const response = await reportApi.exportReport(format, startDate, endDate);
      const blob = new Blob([response.data], {
        type: format === "csv" ? "text/csv" : "application/pdf",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `expense_report_${startDate || "all"}_to_${
        endDate || "all"
      }.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      setExportSuccess(
        `Successfully downloaded ${format.toUpperCase()} report!`,
      );
    } catch (err) {
      setExportError(
        err.response?.data?.detail ||
          `Failed to export ${format.toUpperCase()} report.`,
      );
    } finally {
      if (format === "csv") setExportingCsv(false);
      if (format === "pdf") setExportingPdf(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-lg text-slate-900">
            Custom Date Range & Export
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Filter analytics and export formatted transaction records &
            financial summaries
          </p>
        </div>

        {/* Date Range Selection */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Messages */}
      {exportError && (
        <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 font-medium">
          {exportError}
        </div>
      )}
      {exportSuccess && (
        <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 font-medium">
          {exportSuccess}
        </div>
      )}

      {/* Export Action Buttons */}
      <div className="mt-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button
          onClick={() => handleExport("csv")}
          disabled={exportingCsv || exportingPdf}
          className="flex-1 flex items-center justify-center gap-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold px-4 py-2.5 rounded-lg text-sm shadow-sm transition-all disabled:opacity-50"
        >
          {exportingCsv ? (
            <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
          ) : (
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          )}
          <span>Export CSV Report</span>
        </button>

        <button
          onClick={() => handleExport("pdf")}
          disabled={exportingCsv || exportingPdf}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-lg text-sm shadow-sm transition-all disabled:opacity-50"
        >
          {exportingPdf ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <FileText className="w-4 h-4" />
          )}
          <span>Export PDF Summary</span>
        </button>
      </div>
    </div>
  );
}
