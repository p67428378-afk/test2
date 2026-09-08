import React, { useState } from "react";
import { exportItinerary } from "../services/api";

export default function ExportItineraryModal({
  isOpen,
  onClose,
  recommendationId,
  destination = "Trip",
  defaultFormat = "json",
}) {
  const [exportFormat, setExportFormat] = useState(defaultFormat);
  const [includeCostSummary, setIncludeCostSummary] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [exportResult, setExportResult] = useState(null);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [downloadFallbackText, setDownloadFallbackText] = useState("");

  if (!isOpen) return null;

  const handleExport = async (e) => {
    if (e) e.preventDefault();
    if (!recommendationId) {
      setError("Recommendation ID is missing. Cannot export.");
      return;
    }

    setIsExporting(true);
    setError(null);
    setExportResult(null);
    setDownloadFallbackText("");
    setCopySuccess(false);

    try {
      const payload = {
        recommendation_id: String(recommendationId),
        export_format: exportFormat,
        include_cost_summary: includeCostSummary,
      };

      const result = await exportItinerary(payload);
      setExportResult(result);

      if (result.share_url && exportFormat === "link") {
        // Link export format
      } else if (result.content_base64) {
        // Attempt file download
        try {
          const byteCharacters = atob(result.content_base64);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], {
            type: result.mime_type || "application/octet-stream",
          });

          const blobUrl = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = blobUrl;
          link.download =
            result.file_name || `${destination}_Itinerary.${exportFormat}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);

          // For JSON or text fallback preview
          if (
            exportFormat === "json" ||
            result.mime_type === "application/json"
          ) {
            setDownloadFallbackText(byteCharacters);
          }
        } catch (downloadErr) {
          console.warn(
            "Direct file download encountered an issue, showing fallback text:",
            downloadErr,
          );
          try {
            const rawText = atob(result.content_base64);
            setDownloadFallbackText(rawText);
          } catch (decodeErr) {
            setDownloadFallbackText(
              "File generated successfully. Direct download could not be completed automatically.",
            );
          }
        }
      }
    } catch (err) {
      console.error("Export error:", err);
      const msg =
        err.response?.data?.detail ||
        "Export failed. Please check your connection and try again.";
      setError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyLink = async () => {
    const urlToCopy = exportResult?.share_url || window.location.href;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(urlToCopy);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      } else {
        // Fallback copy
        const textArea = document.createElement("textarea");
        textArea.value = urlToCopy;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleCopyFallbackText = async () => {
    if (!downloadFallbackText) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(downloadFallbackText);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = downloadFallbackText;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    } catch (err) {
      console.error("Failed to copy raw content:", err);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 relative animate-in fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100"
          aria-label="Close export dialog"
        >
          ×
        </button>

        <h2
          id="export-modal-title"
          className="text-xl font-bold text-slate-900 mb-1"
        >
          Export & Share Itinerary
        </h2>
        <p className="text-sm text-slate-500 mb-5">
          Download your personalized itinerary for {destination} or share it
          with others.
        </p>

        {error && (
          <div
            role="alert"
            className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm font-medium"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleExport} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Export Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setExportFormat("json")}
                className={`p-3 rounded-xl border text-sm font-semibold transition text-center ${
                  exportFormat === "json"
                    ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="block text-lg mb-1">📄</span>
                JSON File
              </button>
              <button
                type="button"
                onClick={() => setExportFormat("pdf")}
                className={`p-3 rounded-xl border text-sm font-semibold transition text-center ${
                  exportFormat === "pdf"
                    ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="block text-lg mb-1">📑</span>
                PDF Doc
              </button>
              <button
                type="button"
                onClick={() => setExportFormat("link")}
                className={`p-3 rounded-xl border text-sm font-semibold transition text-center ${
                  exportFormat === "link"
                    ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500"
                    : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="block text-lg mb-1">🔗</span>
                Share Link
              </button>
            </div>
          </div>

          <div className="pt-1">
            <label className="flex items-center space-x-2 text-sm text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={includeCostSummary}
                onChange={(e) => setIncludeCostSummary(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span>Include Budget & Total Cost Summary</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isExporting}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 transition shadow-sm"
          >
            {isExporting
              ? "Processing Export..."
              : exportFormat === "link"
                ? "Generate Share Link"
                : `Export as ${exportFormat.toUpperCase()}`}
          </button>
        </form>

        {/* Results / Fallback Section */}
        {exportResult && (
          <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            {exportFormat === "link" ? (
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Shareable Itinerary Link
                </p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={exportResult.share_url}
                    className="flex-1 p-2 bg-white text-xs text-slate-800 rounded-lg border border-slate-300 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700"
                  >
                    {copySuccess ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-green-700 flex items-center gap-1">
                    ✓ Download initiated: {exportResult.file_name}
                  </span>
                  {downloadFallbackText && (
                    <button
                      type="button"
                      onClick={handleCopyFallbackText}
                      className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      {copySuccess ? "Copied content!" : "Copy Raw Text"}
                    </button>
                  )}
                </div>
                {downloadFallbackText && (
                  <div className="mt-2">
                    <label className="block text-xs text-slate-500 mb-1">
                      Raw Content (in case download was blocked):
                    </label>
                    <textarea
                      readOnly
                      rows={4}
                      value={downloadFallbackText}
                      className="w-full p-2 bg-white text-xs text-slate-700 rounded-lg border border-slate-300 font-mono"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
