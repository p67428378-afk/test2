import React from "react";
import {
  Save,
  Download,
  Copy,
  Check,
  Columns,
  FileEdit,
  Eye,
  ShieldCheck,
  Loader2,
  FileDown,
} from "lucide-react";

export default function DocHeader({
  title,
  setTitle,
  saveStatus, // 'saved', 'unsaved', 'saving', 'error'
  onSave,
  onExportMarkdown,
  onExportHTML,
  onCopyMarkdown,
  onCopyHTML,
  copiedType, // 'md', 'html', or null
  viewMode, // 'split', 'editor', 'preview'
  setViewMode,
  stats = { words: 0, chars: 0, lines: 1 },
}) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Title Input & Save Status */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition">
            <span className="text-gray-400 font-mono text-sm">📄</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Document Title.md"
              aria-label="Document Title"
              className="bg-transparent text-sm font-semibold text-gray-900 focus:outline-none w-48 sm:w-64 placeholder-gray-400"
            />
          </div>

          {/* Save Status Indicator */}
          <div className="flex items-center space-x-1.5 text-xs">
            {saveStatus === "saving" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Saving...
              </span>
            )}
            {saveStatus === "saved" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                <Check className="w-3 h-3 mr-1" />
                Saved to DB
              </span>
            )}
            {saveStatus === "unsaved" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                Unsaved Changes
              </span>
            )}
            {saveStatus === "error" && (
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 font-medium">
                Save Failed
              </span>
            )}
          </div>

          {/* Stats Counters */}
          <div className="hidden xl:flex items-center space-x-3 text-xs text-gray-500 bg-gray-100/70 px-3 py-1.5 rounded-lg border border-gray-200/60 font-mono">
            <span>{stats.words} words</span>
            <span className="text-gray-300">•</span>
            <span>{stats.chars} chars</span>
            <span className="text-gray-300">•</span>
            <span>{stats.lines} lines</span>
          </div>
        </div>

        {/* Action Controls & View Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Toggle Buttons */}
          <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 text-xs font-medium">
            <button
              onClick={() => setViewMode("split")}
              title="Split View (Editor & Live Preview)"
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md transition ${
                viewMode === "split"
                  ? "bg-white text-blue-700 shadow-xs font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Split</span>
            </button>
            <button
              onClick={() => setViewMode("editor")}
              title="Editor Only"
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md transition ${
                viewMode === "editor"
                  ? "bg-white text-blue-700 shadow-xs font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Editor</span>
            </button>
            <button
              onClick={() => setViewMode("preview")}
              title="Preview Only"
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-md transition ${
                viewMode === "preview"
                  ? "bg-white text-blue-700 shadow-xs font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Preview</span>
            </button>
          </div>

          <div className="h-5 w-px bg-gray-200 hidden sm:block"></div>

          {/* Copy Actions */}
          <div className="flex items-center space-x-1">
            <button
              onClick={onCopyMarkdown}
              title="Copy raw Markdown to clipboard"
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 transition"
            >
              {copiedType === "md" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-green-700 font-semibold">
                    Copied MD!
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gray-500" />
                  <span>Copy MD</span>
                </>
              )}
            </button>

            <button
              onClick={onCopyHTML}
              title="Copy rendered HTML to clipboard"
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 transition"
            >
              {copiedType === "html" ? (
                <>
                  <Check className="w-3.5 h-3.5 text-green-600" />
                  <span className="text-green-700 font-semibold">
                    Copied HTML!
                  </span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-gray-500" />
                  <span>Copy HTML</span>
                </>
              )}
            </button>
          </div>

          {/* Export Dropdown / Buttons */}
          <div className="flex items-center space-x-1">
            <button
              onClick={onExportMarkdown}
              title="Download Markdown (.md) file"
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-medium transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .md</span>
            </button>
            <button
              onClick={onExportHTML}
              title="Download HTML (.html) file"
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-medium transition"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Export .html</span>
            </button>
          </div>

          {/* Save Button */}
          <button
            onClick={onSave}
            disabled={saveStatus === "saving"}
            className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition"
          >
            {saveStatus === "saving" ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>Save Document</span>
          </button>
        </div>
      </div>
    </div>
  );
}
