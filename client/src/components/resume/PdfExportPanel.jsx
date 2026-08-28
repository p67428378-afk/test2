import React, { useState } from "react";
import {
  Download,
  Printer,
  CheckCircle,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { exportResumePdf, downloadPdfBlob } from "../../services/api";

export default function PdfExportPanel({ resumeId, resumeTitle = "Resume" }) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleExport = async () => {
    if (!resumeId) {
      setError("Please save the resume before exporting PDF.");
      return;
    }

    setIsExporting(true);
    setError(null);
    setSuccess(false);

    try {
      const blob = await exportResumePdf(resumeId);
      const sanitizedTitle = (resumeTitle || "Resume").replace(
        /[^a-zA-Z0-9_-]/g,
        "_",
      );
      downloadPdfBlob(blob, `Resume_${sanitizedTitle}.pdf`);
      setSuccess(true);
    } catch (err) {
      console.error("PDF export failed:", err);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to generate and download PDF. Please ensure the backend is running.",
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm no-print">
      <div className="flex items-center space-x-2 border-b border-gray-100 pb-4 mb-5">
        <Sparkles className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-bold text-gray-900">
          PDF CV Export &amp; Download
        </h2>
      </div>

      <p className="text-sm text-gray-600 mb-6">
        Generate a clean, high-resolution PDF document formatted for applicant
        tracking systems (ATS) and executive review.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2 text-red-700 text-sm">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2 text-green-700 text-sm">
          <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
          <span>PDF successfully downloaded! Check your downloads folder.</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleExport}
          disabled={isExporting}
          className="flex-1 flex items-center justify-center space-x-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Generating PDF...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>Download PDF CV</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-colors border border-gray-200"
        >
          <Printer className="w-5 h-5 text-gray-500" />
          <span>Print Preview</span>
        </button>
      </div>

      <div className="mt-4 text-center">
        <span className="text-xs text-gray-400">
          Streams dynamically via <code>/api/v1/resumes/{`{id}`}/export</code>
        </span>
      </div>
    </div>
  );
}
