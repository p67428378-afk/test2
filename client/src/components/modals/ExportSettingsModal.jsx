import React, { useState } from "react";
import {
  X,
  Download,
  Copy,
  Check,
  FileDown,
  Settings,
  Shield,
  Clock,
  FileText,
} from "lucide-react";
import { marked } from "marked";
import DOMPurify from "dompurify";

export default function ExportSettingsModal({
  isOpen,
  onClose,
  documentData = {},
  enableSanitization = true,
  onToggleSanitization,
  autoSaveEnabled = true,
  onToggleAutoSave,
}) {
  const [exportFormat, setExportFormat] = useState("md"); // 'md' | 'html' | 'txt'
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const title = documentData.title || "Untitled Document";
  const content = documentData.content || "";
  const byteSize = new Blob([content]).size;

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 B";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const generateExportContent = () => {
    if (exportFormat === "md") {
      return { data: content, type: "text/markdown", extension: ".md" };
    } else if (exportFormat === "html") {
      const rawHtml = marked.parse(content);
      const cleanHtml = enableSanitization
        ? DOMPurify.sanitize(rawHtml)
        : rawHtml;
      const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 2rem; color: #171C29; }
    h1, h2, h3 { color: #171C29; border-bottom: 1px solid #E3E8F0; padding-bottom: 0.3em; }
    pre { background: #1E293B; color: #F8FAFC; padding: 1rem; border-radius: 6px; overflow-x: auto; }
    code { background: #EEF2F6; color: #D946EF; padding: 0.2em 0.4em; border-radius: 4px; }
    blockquote { border-left: 4px solid #2663EB; margin: 0; padding-left: 1rem; color: #707A8C; }
    table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
    th, td { border: 1px solid #E3E8F0; padding: 0.5rem; text-align: left; }
    th { background: #F2F5FA; }
  </style>
</head>
<body>
${cleanHtml}
</body>
</html>`;
      return { data: fullHtml, type: "text/html", extension: ".html" };
    } else {
      // Plain text (strip basic markdown tags or raw text)
      return { data: content, type: "text/plain", extension: ".txt" };
    }
  };

  const handleDownload = () => {
    const { data, type, extension } = generateExportContent();
    const sanitizedFilename =
      (title || "document").replace(/[^a-z0-9_\-]/gi, "_") + extension;
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = sanitizedFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyContent = async () => {
    const { data } = generateExportContent();
    try {
      await navigator.clipboard.writeText(data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-lg w-full border border-[#E3E8F0] overflow-hidden transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#E3E8F0] bg-[#FAFCFF] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-blue flex items-center justify-center border border-blue-100">
              <FileDown className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#171C29]">
                Document Export & Settings
              </h2>
              <p className="text-xs text-[#707A8C]">
                Configure export formats and editor behaviors
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#707A8C] mb-2">
              Export Format
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  id: "md",
                  label: "Markdown (.md)",
                  desc: "Raw source syntax",
                },
                {
                  id: "html",
                  label: "HTML (.html)",
                  desc: "Rendered web page",
                },
                { id: "txt", label: "Text (.txt)", desc: "Plain text file" },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setExportFormat(fmt.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    exportFormat === fmt.id
                      ? "border-brand-blue bg-blue-50 ring-2 ring-brand-blue ring-opacity-20"
                      : "border-[#E3E8F0] hover:border-gray-300 bg-white"
                  }`}
                >
                  <div
                    className={`text-xs font-bold ${exportFormat === fmt.id ? "text-brand-blue" : "text-[#171C29]"}`}
                  >
                    {fmt.label}
                  </div>
                  <div className="text-[11px] text-[#707A8C] mt-0.5">
                    {fmt.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Document Statistics */}
          <div className="bg-[#F2F5FA] rounded-lg p-4 border border-[#E3E8F0]">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#707A8C] mb-3 flex items-center">
              <FileText className="w-3.5 h-3.5 mr-1 text-brand-blue" />
              Document Statistics
            </h3>
            <div className="grid grid-cols-2 gap-y-2 text-xs">
              <div className="text-[#707A8C]">Document Title:</div>
              <div className="font-medium text-[#171C29] truncate">{title}</div>
              <div className="text-[#707A8C]">Document ID:</div>
              <div className="font-mono text-xs text-[#171C29]">
                {documentData.id || "Draft (Unsaved)"}
              </div>
              <div className="text-[#707A8C]">Word Count:</div>
              <div className="font-medium text-[#171C29]">
                {content.trim() ? content.trim().split(/\s+/).length : 0} words
              </div>
              <div className="text-[#707A8C]">File Size:</div>
              <div className="font-medium text-[#171C29]">
                {formatBytes(byteSize)}
              </div>
            </div>
          </div>

          {/* Editor Settings Toggles */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#707A8C] flex items-center">
              <Settings className="w-3.5 h-3.5 mr-1 text-brand-blue" />
              Editor Configuration
            </h3>

            {/* DOMPurify Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-[#E3E8F0]">
              <div className="flex items-center space-x-2.5">
                <Shield className="w-4 h-4 text-brand-accent" />
                <div>
                  <div className="text-xs font-semibold text-[#171C29]">
                    XSS Sanitization (DOMPurify)
                  </div>
                  <div className="text-[11px] text-[#707A8C]">
                    Sanitize malicious tags in HTML preview & export
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                aria-label="XSS Sanitization"
                checked={enableSanitization}
                onChange={(e) => onToggleSanitization?.(e.target.checked)}
                className="w-4 h-4 text-brand-blue rounded border-gray-300 focus:ring-brand-blue"
              />
            </div>

            {/* 30s Auto-save Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg border border-[#E3E8F0]">
              <div className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 text-brand-blue" />
                <div>
                  <div className="text-xs font-semibold text-[#171C29]">
                    Periodic Auto-Save (30s)
                  </div>
                  <div className="text-[11px] text-[#707A8C]">
                    Automatically persist modifications to backend
                  </div>
                </div>
              </div>
              <input
                type="checkbox"
                aria-label="Periodic Auto-Save"
                checked={autoSaveEnabled}
                onChange={(e) => onToggleAutoSave?.(e.target.checked)}
                className="w-4 h-4 text-brand-blue rounded border-gray-300 focus:ring-brand-blue"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[#FAFCFF] border-t border-[#E3E8F0] flex items-center justify-between">
          <button
            type="button"
            onClick={handleCopyContent}
            className="flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-[#707A8C] hover:text-[#171C29] bg-white border border-[#E3E8F0] rounded-lg hover:bg-gray-50 transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-brand-accent" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copied ? "Copied!" : "Copy to Clipboard"}</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-[#707A8C] hover:text-[#171C29] bg-white border border-[#E3E8F0] rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center space-x-1.5 px-4 py-2 text-xs font-medium text-white bg-brand-blue hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download {exportFormat.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
