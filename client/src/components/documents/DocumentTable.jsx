import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Calendar,
  Clock,
  Trash2,
  ExternalLink,
  Search,
  Plus,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

export default function DocumentTable({
  documents = [],
  total = 0,
  skip = 0,
  limit = 20,
  isLoading = false,
  error = null,
  onPageChange,
  onDeleteDocument,
  onRefresh,
}) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Filter documents locally by search query
  const filteredDocuments = documents.filter((doc) =>
    (doc.title || "Untitled Document")
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  const formatDate = (isoString) => {
    if (!isoString) return "—";
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  const handleOpenDoc = (id) => {
    navigate(`/editor/${id}`);
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (deleteConfirmId === id) {
      await onDeleteDocument(id);
      setDeleteConfirmId(null);
    } else {
      setDeleteConfirmId(id);
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;
  const currentPage = Math.floor(skip / limit) + 1;

  return (
    <div className="bg-white border border-[#E3E8F0] rounded-xl shadow-sm overflow-hidden flex flex-col">
      {/* Controls Bar */}
      <div className="p-4 sm:p-6 border-b border-[#E3E8F0] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-[#FAFCFF]">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#707A8C] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search documents by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-[#E3E8F0] rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent text-[#171C29] placeholder-[#707A8C]"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            className="p-2 border border-[#E3E8F0] rounded-lg text-[#707A8C] hover:text-[#171C29] hover:bg-gray-50 focus:outline-none transition-colors"
            title="Refresh list"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin text-brand-blue" : ""}`}
            />
          </button>
          <button
            type="button"
            onClick={() => navigate("/editor")}
            className="flex items-center space-x-2 bg-brand-blue hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Document</span>
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-50 border-b border-red-200 text-brand-error text-sm flex items-center">
          <AlertCircle className="w-4 h-4 mr-2 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[#E3E8F0] text-left text-sm">
          <thead className="bg-[#F2F5FA] text-[#707A8C] font-semibold text-xs uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-6 py-3.5">
                Document Title
              </th>
              <th scope="col" className="px-6 py-3.5">
                Last Updated
              </th>
              <th scope="col" className="px-6 py-3.5">
                Created Date
              </th>
              <th scope="col" className="px-6 py-3.5 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E3E8F0] bg-white">
            {isLoading && documents.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-12 text-center text-[#707A8C]"
                >
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-blue" />
                  <span>Loading documents...</span>
                </td>
              </tr>
            ) : filteredDocuments.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="px-6 py-16 text-center text-[#707A8C]"
                >
                  <FileText className="w-12 h-12 stroke-1 mx-auto mb-3 text-gray-300" />
                  <p className="text-base font-semibold text-[#171C29]">
                    No Markdown documents found
                  </p>
                  <p className="text-sm mt-1 max-w-sm mx-auto">
                    {searchQuery
                      ? "No documents matched your search filter. Try clearing the filter."
                      : "Get started by creating your first Markdown document with live HTML preview."}
                  </p>
                  {!searchQuery && (
                    <button
                      type="button"
                      onClick={() => navigate("/editor")}
                      className="mt-4 inline-flex items-center space-x-2 bg-brand-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Document</span>
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              filteredDocuments.map((doc) => (
                <tr
                  key={doc.id}
                  onClick={() => handleOpenDoc(doc.id)}
                  className="hover:bg-[#F7FAFC] cursor-pointer transition-colors group"
                >
                  {/* Title & icon */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded bg-blue-50 text-brand-blue flex items-center justify-center shrink-0 border border-blue-100 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#171C29] group-hover:text-brand-blue transition-colors">
                          {doc.title || "Untitled Document"}
                        </div>
                        <div className="text-xs text-[#707A8C] font-mono">
                          ID: {doc.id.substring(0, 8)}...
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Updated */}
                  <td className="px-6 py-4 whitespace-nowrap text-[#707A8C] text-xs">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatDate(doc.updated_at)}</span>
                    </div>
                  </td>

                  {/* Created */}
                  <td className="px-6 py-4 whitespace-nowrap text-[#707A8C] text-xs">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{formatDate(doc.created_at)}</span>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                    <div
                      className="flex items-center justify-end space-x-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => handleOpenDoc(doc.id)}
                        className="p-1.5 rounded text-brand-blue hover:bg-blue-50 transition-colors"
                        title="Open in Editor"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={(e) => handleDelete(doc.id, e)}
                        className={`p-1.5 rounded transition-colors ${
                          deleteConfirmId === doc.id
                            ? "bg-red-500 text-white px-2.5 py-1 text-xs font-semibold"
                            : "text-gray-400 hover:text-brand-error hover:bg-red-50"
                        }`}
                        title={
                          deleteConfirmId === doc.id
                            ? "Click again to confirm delete"
                            : "Delete document"
                        }
                      >
                        {deleteConfirmId === doc.id ? (
                          "Confirm Delete?"
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {total > 0 && (
        <div className="px-6 py-3.5 bg-[#F2F5FA] border-t border-[#E3E8F0] flex items-center justify-between text-xs text-[#707A8C]">
          <div>
            Showing{" "}
            <strong className="text-[#171C29]">
              {Math.min(skip + 1, total)}
            </strong>{" "}
            to{" "}
            <strong className="text-[#171C29]">
              {Math.min(skip + limit, total)}
            </strong>{" "}
            of <strong className="text-[#171C29]">{total}</strong> documents
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              disabled={skip === 0 || isLoading}
              onClick={() => onPageChange(Math.max(0, skip - limit))}
              className="px-3 py-1.5 rounded bg-white border border-[#E3E8F0] font-medium text-[#171C29] disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <span className="px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={skip + limit >= total || isLoading}
              onClick={() => onPageChange(skip + limit)}
              className="px-3 py-1.5 rounded bg-white border border-[#E3E8F0] font-medium text-[#171C29] disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
