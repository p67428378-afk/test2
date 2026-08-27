import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Plus,
  HardDrive,
  ShieldCheck,
  Sparkles,
  BookOpen,
} from "lucide-react";
import DocumentTable from "../components/documents/DocumentTable";
import { fetchDocuments, deleteDocument } from "../services/api";

export default function DocumentLibraryPage() {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadDocuments = useCallback(
    async (currentSkip = 0) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchDocuments(currentSkip, limit);
        setDocuments(data.items || []);
        setTotal(data.total || 0);
        setSkip(data.skip || 0);
      } catch (err) {
        setError(
          "Unable to load documents from server. Please verify backend service.",
        );
      } finally {
        setIsLoading(false);
      }
    },
    [limit],
  );

  useEffect(() => {
    loadDocuments(0);
  }, [loadDocuments]);

  const handleDelete = async (id) => {
    try {
      await deleteDocument(id);
      // Reload current page or previous page if last item
      const newSkip =
        documents.length === 1 && skip > 0 ? Math.max(0, skip - limit) : skip;
      await loadDocuments(newSkip);
    } catch (err) {
      setError(
        "Failed to delete document: " +
          (err.response?.data?.detail || err.message),
      );
    }
  };

  const handlePageChange = (newSkip) => {
    loadDocuments(newSkip);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#171C29] tracking-tight">
            Document Library
          </h1>
          <p className="text-sm text-[#707A8C] mt-1">
            Browse, manage, and create Markdown documents with real-time preview
            and auto-save.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/editor")}
          className="inline-flex items-center space-x-2 bg-brand-blue hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Markdown Document</span>
        </button>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Total Documents */}
        <div className="bg-white p-5 rounded-xl border border-[#E3E8F0] shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-brand-blue shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#707A8C]">
              Saved Documents
            </div>
            <div className="text-2xl font-bold text-[#171C29] mt-0.5">
              {total}
            </div>
          </div>
        </div>

        {/* Max Size */}
        <div className="bg-white p-5 rounded-xl border border-[#E3E8F0] shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-brand-accent shrink-0">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#707A8C]">
              Max Doc Limit
            </div>
            <div className="text-2xl font-bold text-[#171C29] mt-0.5">5 MB</div>
          </div>
        </div>

        {/* Real-time Render Speed */}
        <div className="bg-white p-5 rounded-xl border border-[#E3E8F0] shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#707A8C]">
              Preview Latency
            </div>
            <div className="text-2xl font-bold text-[#171C29] mt-0.5">
              &lt; 100 ms
            </div>
          </div>
        </div>

        {/* Security / XSS Sanitizer */}
        <div className="bg-white p-5 rounded-xl border border-[#E3E8F0] shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#707A8C]">
              XSS Protection
            </div>
            <div className="text-2xl font-bold text-[#171C29] mt-0.5">
              DOMPurify
            </div>
          </div>
        </div>
      </div>

      {/* Main Document Table */}
      <DocumentTable
        documents={documents}
        total={total}
        skip={skip}
        limit={limit}
        isLoading={isLoading}
        error={error}
        onPageChange={handlePageChange}
        onDeleteDocument={handleDelete}
        onRefresh={() => loadDocuments(skip)}
      />
    </div>
  );
}
