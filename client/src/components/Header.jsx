import React from "react";
import { FileText, Download, Sparkles, CheckCircle2 } from "lucide-react";

export default function Header({
  onExportPdf,
  isExporting,
  selectedTemplate,
  onTemplateChange,
}) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-lg">
                  Quick Resume Maker
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  <Sparkles className="w-3 h-3" />
                  PDF Vector CV
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Create structured resumes & export high-quality printable PDF
                CVs
              </p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Template Switcher */}
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
              <button
                type="button"
                onClick={() => onTemplateChange("classic")}
                className={`px-3 py-1 rounded-md transition ${
                  selectedTemplate === "classic"
                    ? "bg-white text-indigo-600 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Classic
              </button>
              <button
                type="button"
                onClick={() => onTemplateChange("modern")}
                className={`px-3 py-1 rounded-md transition ${
                  selectedTemplate === "modern"
                    ? "bg-white text-indigo-600 shadow-xs font-semibold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Modern
              </button>
            </div>

            {/* Export PDF Button */}
            <button
              type="button"
              onClick={onExportPdf}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg shadow-sm shadow-indigo-200 transition"
            >
              <Download
                className={`w-4 h-4 ${isExporting ? "animate-bounce" : ""}`}
              />
              {isExporting ? "Generating PDF..." : "Export PDF"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
