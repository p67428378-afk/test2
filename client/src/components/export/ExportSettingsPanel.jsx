import React, { useState } from "react";
import {
  Download,
  FileText,
  Settings,
  Sliders,
  CheckCircle2,
} from "lucide-react";

export default function ExportSettingsPanel({
  userName = "User",
  templateId = "classic",
  isExporting = false,
  onExportPdf,
}) {
  const safeName = (userName || "User").replace(/\s+/g, "_");
  const defaultFileName = `${safeName}_Resume.pdf`;

  const [fileName, setFileName] = useState(defaultFileName);
  const [pageSize, setPageSize] = useState("A4");
  const [margins, setMargins] = useState("normal");
  const [fontScale, setFontScale] = useState("standard");
  const [vectorOptimization, setVectorOptimization] = useState(true);

  const handleExport = (e) => {
    if (e) e.preventDefault();
    if (onExportPdf) {
      onExportPdf({
        fileName: fileName.endsWith(".pdf") ? fileName : `${fileName}.pdf`,
        pageSize,
        margins,
        fontScale,
        vectorOptimization,
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-6">
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        <Settings className="w-5 h-5 text-indigo-600" />
        <div>
          <h2 className="text-base font-bold text-slate-900">
            PDF Export & Print Settings
          </h2>
          <p className="text-xs text-slate-500">
            Configure document parameters before generating vector PDF CV.
          </p>
        </div>
      </div>

      <form onSubmit={handleExport} className="space-y-4">
        {/* Output File Name */}
        <div>
          <label
            htmlFor="export_file_name"
            className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between"
          >
            <span>Output File Name</span>
            <span className="text-[11px] text-slate-400 font-normal">
              Defaults to [User_Name]_Resume.pdf
            </span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <FileText className="w-4 h-4" />
            </div>
            <input
              id="export_file_name"
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Candidate_Name_Resume.pdf"
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Paper Size & Margins */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="export_page_size"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Paper Format
            </label>
            <select
              id="export_page_size"
              value={pageSize}
              onChange={(e) => setPageSize(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              <option value="A4">A4 (Standard 210 x 297 mm)</option>
              <option value="Letter">US Letter (8.5 x 11 in)</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="export_margins"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Page Margins
            </label>
            <select
              id="export_margins"
              value={margins}
              onChange={(e) => setMargins(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              <option value="normal">Standard (0.75 in / 20 mm)</option>
              <option value="compact">Compact (0.5 in / 12 mm)</option>
              <option value="spacious">Relaxed (1.0 in / 25 mm)</option>
            </select>
          </div>
        </div>

        {/* Font Scale & Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="export_font_scale"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              Typography Scale
            </label>
            <select
              id="export_font_scale"
              value={fontScale}
              onChange={(e) => setFontScale(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              <option value="standard">
                Standard (10pt body / 14pt headings)
              </option>
              <option value="compact">Compact (9pt body - fits 1 page)</option>
              <option value="large">Large (11pt body - high legibility)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Active Template
            </label>
            <div className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium capitalize flex items-center justify-between">
              <span>{templateId} Template</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* Vector Optimization Toggle */}
        <div className="pt-1">
          <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={vectorOptimization}
              onChange={(e) => setVectorOptimization(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 h-4 w-4"
            />
            <span>Enable Vector High-DPI & Selectable Text Encoding</span>
          </label>
          <p className="text-[11px] text-slate-400 pl-6 mt-0.5">
            Generates crisp, search-indexed text and vector graphical dividers
            for ATS scanning.
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isExporting}
            className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl shadow-md transition disabled:opacity-50 text-sm"
          >
            <Download className="w-4 h-4" />
            {isExporting
              ? "Compiling & Exporting PDF..."
              : "Export & Download PDF CV"}
          </button>
        </div>
      </form>
    </div>
  );
}
