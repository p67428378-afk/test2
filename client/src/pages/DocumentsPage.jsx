import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DocumentLibraryTable from "../components/documents/DocumentLibraryTable";
import { getDocuments, deleteDocument } from "../services/api";

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const navigate = useNavigate();

  const fetchDocs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDocuments(0, 100);
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
      setError(
        "Unable to load documents from database. Make sure backend is running.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const handleOpenDocument = (doc) => {
    navigate(`/?id=${doc.id}`);
  };

  const handleNewDocument = () => {
    navigate("/");
  };

  const handleDeleteDocument = async (id, title) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${title || "this document"}"?`,
      )
    ) {
      return;
    }

    try {
      await deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      setToastMessage(`Document "${title || "Untitled"}" deleted`);
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error("Delete failed:", err);
      setError(
        `Failed to delete document: ${err.response?.data?.detail || err.message}`,
      );
    }
  };

  return (
    <div className="flex-1 bg-[#F7FAFC] overflow-y-auto p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Title */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Document Library
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Browse, manage, and export all Markdown documents stored in your
              PostgreSQL database.
            </p>
          </div>
        </div>

        {/* Feedback Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 font-bold ml-2"
            >
              ✕
            </button>
          </div>
        )}

        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 bg-emerald-700 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm flex items-center space-x-2 animate-fade-in">
            <span>✓</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Documents Table */}
        <DocumentLibraryTable
          documents={documents}
          loading={loading}
          onOpenDocument={handleOpenDocument}
          onDeleteDocument={handleDeleteDocument}
          onNewDocument={handleNewDocument}
        />
      </div>
    </div>
  );
}
