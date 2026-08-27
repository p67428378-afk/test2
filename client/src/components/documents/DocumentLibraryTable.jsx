import React, { useState } from "react";
import {
  FileText,
  Trash2,
  ExternalLink,
  Download,
  Copy,
  Check,
  Search,
  Plus,
  Calendar,
  Database,
  Layers,
  ArrowUpDown,
} from "lucide-react";

export default function DocumentLibraryTable({
  documents = [],
  loading = false,
  onOpenDocument,
  onDeleteDocument,
  onNewDocument,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("updated_at"); // 'updated_at', 'title', 'created_at'
  const [sortOrder, setSortOrder] = useState("desc"); // 'asc', 'desc'
  const [copiedDocId, setCopiedDocId] = useState(null);

  // Compute metrics
  const totalDocs = documents.length;
  const totalWords = documents.reduce((sum, doc) => {
    const text = doc.content || "";
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    return sum + words;
  }, 0);
  const totalChars = documents.reduce(
    (sum, doc) => sum + (doc.content?.length || 0),
    0,
  );

  // Filter and sort documents
  const filteredDocs = documents
    .filter((doc) => {
      const term = searchTerm.toLowerCase();
      const titleMatch = (doc.title || "").toLowerCase().includes(term);
      const contentMatch = (doc.content || "").toLowerCase().includes(term);
      return titleMatch || contentMatch;
    })
    .sort((a, b) => {
      let fieldA = a[sortBy] || "";
      let fieldB = b[sortBy] || "";
      if (sortBy === "title") {
        fieldA = fieldA.toLowerCase();
        fieldB = fieldB.toLowerCase();
      }
      if (sortOrder === "asc") {
        return fieldA > fieldB ? 1 : -1;
      }
      return fieldA < fieldB ? 1 : -1;
    });

  const handleCopy = async (doc) => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(doc.content || "");
        setCopiedDocId(doc.id);
        setTimeout(() => setCopiedDocId(null), 2000);
      }
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleDownload = (doc) => {
    const filename =
      (doc.title || "document").replace(/[/\\?%*:|"<>]/g, "-") + ".md";
    const blob = new Blob([doc.content || ""], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (isoString) => {
    if (!isoString) return "Just now";
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Documents
            </p>
            <p className="text-2xl font-bold text-gray-900">{totalDocs}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Total Words Composed
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {totalWords.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Storage Engine
            </p>
            <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              PostgreSQL DB Connected
            </p>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-xs overflow-hidden">
        {/* Controls Bar */}
        <div className="p-4 sm:p-5 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search documents by title or text..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
            />
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-xs text-gray-600">
              <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs bg-white text-gray-800 focus:outline-none focus:border-blue-500"
              >
                <option value="updated_at">Last Updated</option>
                <option value="created_at">Created Date</option>
                <option value="title">Title</option>
              </select>
              <button
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="border border-gray-200 rounded-lg px-2 py-1 text-xs hover:bg-gray-100 font-medium"
                title="Toggle sort order"
              >
                {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
              </button>
            </div>

            <button
              onClick={onNewDocument}
              className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-lg text-sm font-medium shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>New Document</span>
            </button>
          </div>
        </div>

        {/* Table List */}
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-sm">Loading saved documents...</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-1">
              {searchTerm
                ? "No matching documents found"
                : "No documents saved yet"}
            </h3>
            <p className="text-sm text-gray-500 max-w-sm mx-auto mb-5">
              {searchTerm
                ? "Try refining your search query or clear the filter."
                : "Start writing in the editor and save your document to PostgreSQL."}
            </p>
            <button
              onClick={onNewDocument}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Document</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-6">Document Title</th>
                  <th className="py-3 px-4">Words & Length</th>
                  <th className="py-3 px-4">Last Modified</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {filteredDocs.map((doc) => {
                  const words = (doc.content || "").trim()
                    ? (doc.content || "").trim().split(/\s+/).length
                    : 0;
                  const chars = (doc.content || "").length;

                  return (
                    <tr
                      key={doc.id}
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
                      <td className="py-4 px-4 sm:px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <button
                              onClick={() => onOpenDocument(doc)}
                              className="font-semibold text-gray-900 hover:text-blue-600 text-left line-clamp-1 group-hover:underline"
                            >
                              {doc.title || "Untitled Document"}
                            </button>
                            <p className="text-xs text-gray-400 line-clamp-1 font-mono">
                              {(doc.content || "").slice(0, 60) ||
                                "Empty document"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-gray-600 text-xs font-mono">
                        <div>{words} words</div>
                        <div className="text-gray-400">{chars} chars</div>
                      </td>

                      <td className="py-4 px-4 text-gray-500 text-xs">
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>
                            {formatDate(doc.updated_at || doc.created_at)}
                          </span>
                        </div>
                      </td>

                      <td className="py-4 px-4 sm:px-6 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button
                            onClick={() => onOpenDocument(doc)}
                            title="Open in Editor"
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleCopy(doc)}
                            title="Copy Markdown"
                            className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md transition"
                          >
                            {copiedDocId === doc.id ? (
                              <Check className="w-4 h-4 text-green-600" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            onClick={() => handleDownload(doc)}
                            title="Download .md"
                            className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-md transition"
                          >
                            <Download className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onDeleteDocument(doc.id, doc.title)}
                            title="Delete Document"
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
