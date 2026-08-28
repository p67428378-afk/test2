import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  PlusCircle,
  Search,
  Download,
  Edit,
  Trash2,
  Calendar,
  Layers,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Eye,
} from "lucide-react";
import {
  getResumes,
  deleteResume,
  exportResumePdf,
  downloadPdfBlob,
} from "../services/api";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [exportingId, setExportingId] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getResumes();
      setResumes(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch resumes:", err);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Unable to load resumes. Ensure backend server is running on port 8000.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    try {
      await deleteResume(deleteTargetId);
      setResumes(resumes.filter((r) => r.id !== deleteTargetId));
      setNotification({
        type: "success",
        message: "Resume deleted successfully.",
      });
      setDeleteTargetId(null);
    } catch (err) {
      console.error("Delete failed:", err);
      setNotification({
        type: "error",
        message: err.response?.data?.detail || "Failed to delete resume.",
      });
    } finally {
      setIsDeleting(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleExportPdf = async (resume) => {
    setExportingId(resume.id);
    try {
      const blob = await exportResumePdf(resume.id);
      const filename = `Resume_${(resume.title || "Resume").replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;
      downloadPdfBlob(blob, filename);
      setNotification({ type: "success", message: `Downloaded ${filename}` });
    } catch (err) {
      console.error("PDF export failed:", err);
      setNotification({
        type: "error",
        message: err.response?.data?.detail || "Failed to export PDF.",
      });
    } finally {
      setExportingId(null);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const filteredResumes = resumes.filter((r) => {
    const query = searchQuery.toLowerCase();
    const titleMatch = r.title?.toLowerCase().includes(query);
    const nameMatch = r.full_name?.toLowerCase().includes(query);
    const emailMatch = r.email?.toLowerCase().includes(query);
    return titleMatch || nameMatch || emailMatch;
  });

  const totalResumes = resumes.length;
  const totalExperiences = resumes.reduce(
    (acc, curr) => acc + (curr.experiences ? curr.experiences.length : 0),
    0,
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`mb-6 p-4 rounded-xl flex items-center justify-between border shadow-sm transition-all ${
            notification.type === "success"
              ? "bg-green-50 text-green-800 border-green-200"
              : "bg-red-50 text-red-800 border-red-200"
          }`}
        >
          <div className="flex items-center space-x-2">
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span className="text-sm font-medium">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-gray-400 hover:text-gray-600 text-sm font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header & Hero Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Resume Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your profiles, create tailored resumes, and export clean PDF
            CVs on-demand.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/editor"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Resume</span>
          </Link>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white p-5 rounded-xl border border-[#e3e8f0] shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">
              Total Resumes
            </p>
            <p className="text-2xl font-extrabold text-gray-900 mt-0.5">
              {totalResumes}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#e3e8f0] shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">
              Recorded Positions
            </p>
            <p className="text-2xl font-extrabold text-gray-900 mt-0.5">
              {totalExperiences}
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-[#e3e8f0] shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase">
              PDF Generation
            </p>
            <p className="text-2xl font-extrabold text-gray-900 mt-0.5">
              Ready
            </p>
          </div>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#e3e8f0] shadow-xs mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, name, or email..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="text-xs text-gray-500 font-medium self-end sm:self-center">
          Showing {filteredResumes.length} of {totalResumes} resumes
        </div>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-[#e3e8f0] p-12 text-center shadow-xs">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-600">
            Loading saved resumes...
          </p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl border border-red-200 p-8 text-center shadow-xs">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-900 mb-1">
            Failed to Load Resumes
          </h3>
          <p className="text-sm text-red-600 max-w-md mx-auto mb-4">{error}</p>
          <button
            onClick={fetchResumes}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      ) : filteredResumes.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12 text-center shadow-xs">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-900 mb-1">
            {searchQuery
              ? "No matching resumes found"
              : "No resumes created yet"}
          </h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
            {searchQuery
              ? "Try adjusting your search terms or clear the search input."
              : "Get started by building your first tailored resume profile with experience and skills."}
          </p>
          <Link
            to="/editor"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Your First Resume</span>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#e3e8f0] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#f8fafc]">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                  >
                    Resume Title &amp; Candidate
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                  >
                    Experience
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                  >
                    Skills
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                  >
                    Last Updated
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3.5 text-right text-xs font-bold text-gray-600 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredResumes.map((resume) => {
                  const expCount = resume.experiences?.length || 0;
                  const skillCount = resume.skills?.length || 0;
                  const isExporting = exportingId === resume.id;

                  return (
                    <tr
                      key={resume.id}
                      className="hover:bg-blue-50/40 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              {resume.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {resume.full_name} • {resume.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          {expCount} {expCount === 1 ? "position" : "positions"}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs text-gray-600 font-medium">
                          {skillCount} {skillCount === 1 ? "skill" : "skills"}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>
                            {resume.updated_at
                              ? new Date(resume.updated_at).toLocaleDateString()
                              : "Recently"}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            type="button"
                            onClick={() => handleExportPdf(resume)}
                            disabled={isExporting}
                            aria-label={`Export PDF for ${resume.title}`}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors title='Export PDF'"
                          >
                            {isExporting ? (
                              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                          </button>

                          <Link
                            to={`/export/${resume.id}`}
                            aria-label={`Preview and Export ${resume.title}`}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <Link
                            to={`/editor/${resume.id}`}
                            aria-label={`Edit ${resume.title}`}
                            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setDeleteTargetId(resume.id)}
                            aria-label={`Delete ${resume.title}`}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              Delete Resume?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this resume? This will permanently
              remove all associated experience, education, and skills entries.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setDeleteTargetId(null)}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors flex items-center space-x-1.5"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : null}
                <span>{isDeleting ? "Deleting..." : "Confirm Delete"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
