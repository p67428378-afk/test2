import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Edit, AlertCircle, Loader2 } from "lucide-react";
import LiveResumePreview from "../components/resume/LiveResumePreview";
import PdfExportPanel from "../components/resume/PdfExportPanel";
import { getResumeById } from "../services/api";

export default function ExportPdfPage() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadResume(id);
    } else {
      setError("No resume ID provided.");
      setIsLoading(false);
    }
  }, [id]);

  const loadResume = async (resumeId) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getResumeById(resumeId);
      setResume(data);
    } catch (err) {
      console.error("Failed to fetch resume for export:", err);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Could not retrieve resume data for PDF export.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto mb-3" />
        <p className="text-gray-600 font-medium">Preparing PDF preview...</p>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl border border-red-200 p-8 text-center shadow-sm">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-gray-900 mb-2">
            Resume Not Found
          </h2>
          <p className="text-sm text-red-600 mb-6">
            {error || "The requested resume could not be found."}
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/"
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200"
            >
              Back to Dashboard
            </Link>
            <Link
              to="/editor"
              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
            >
              Create New Resume
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 no-print">
        <div className="flex items-center space-x-3">
          <Link
            to="/"
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              {resume.title}
            </h1>
            <p className="text-xs text-gray-500">
              PDF CV Generation &amp; Export View
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/editor/${resume.id}`}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 shadow-2xs transition-all"
          >
            <Edit className="w-4 h-4" />
            <span>Edit Information</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Live Document Sheet */}
        <div className="lg:col-span-7">
          <LiveResumePreview resumeData={resume} />
        </div>

        {/* Right: Export Panel */}
        <div className="lg:col-span-5 space-y-6 sticky top-24 no-print">
          <PdfExportPanel resumeId={resume.id} resumeTitle={resume.title} />

          <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 mb-2">
              Export Specifications
            </h3>
            <ul className="text-xs text-gray-600 space-y-2">
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>Format: Standard PDF (A4 / Letter compatible)</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>Typography: Clean Vector Font Rendering</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                <span>ATS Compatible: Single-column clean text stream</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
