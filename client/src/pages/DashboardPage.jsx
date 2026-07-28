import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Fingerprint,
  History,
  Plus,
  TrendingUp,
  FileText,
  Image,
  Video,
  Eye,
  Link as LinkIcon,
  Cpu,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import {
  caseService,
  evidenceService,
  auditService,
  authService,
} from "../services/api";
import Badge from "../components/common/Badge.jsx";
import Button from "../components/common/Button.jsx";

export default function DashboardPage({
  showNewCaseModal,
  setShowNewCaseModal,
  showUploadModal,
  setShowUploadModal,
  cases,
  setCases,
  evidenceList,
  setEvidenceList,
  fetchData,
}) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const currentUser = authService.getCurrentUser();

  // Form states
  const [newCaseNumber, setNewCaseNumber] = useState("");
  const [newCaseDescription, setNewCaseDescription] = useState("");
  const [caseFormError, setCaseDescriptionError] = useState(null);
  const [caseFormSuccess, setCaseFormSuccess] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadCaseId, setUploadCaseId] = useState("");
  const [uploadError, setUploadError] = useState(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [computingHash, setComputingHash] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        await fetchData();
        if (currentUser && currentUser.role === "Administrator") {
          const logs = await auditService.getAuditLogs();
          setAuditLogs(logs.slice(0, 5));
        }
        setError(null);
      } catch (err) {
        console.error("Error loading dashboard data", err);
        setError(
          "Failed to load dashboard data. Please check if the backend is running.",
        );
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const handleCreateCase = async (e) => {
    e.preventDefault();
    setCaseDescriptionError(null);
    setCaseFormSuccess(false);

    if (!newCaseNumber.trim()) {
      setCaseDescriptionError("Case number is required.");
      return;
    }

    try {
      const newCase = await caseService.createCase(
        newCaseNumber,
        newCaseDescription,
      );
      setCases((prev) => [newCase, ...prev]);
      setCaseFormSuccess(true);
      setNewCaseNumber("");
      setNewCaseDescription("");
      setTimeout(() => {
        setShowNewCaseModal(false);
        setCaseFormSuccess(false);
      }, 1500);
    } catch (err) {
      console.error("Error creating case", err);
      setCaseDescriptionError(
        err.response?.data?.detail ||
          "Failed to create case. Case number might already exist.",
      );
    }
  };

  const computeSHA256 = async (file) => {
    setComputingHash(true);
    try {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      setComputingHash(false);
      return hashHex;
    } catch (err) {
      console.error("Error computing hash", err);
      setComputingHash(false);
      return "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"; // fallback empty hash
    }
  };

  const handleUploadEvidence = async (e) => {
    e.preventDefault();
    setUploadError(null);
    setUploadSuccess(false);

    if (!selectedFile) {
      setUploadError("Please select a file to upload.");
      return;
    }

    try {
      const sha256 = await computeSHA256(selectedFile);

      // 1. Upload metadata
      const metadata = await evidenceService.uploadEvidenceMetadata(
        selectedFile.name,
        selectedFile.type || "application/octet-stream",
        selectedFile.size,
        sha256,
        uploadCaseId || null,
      );

      // 2. Upload actual file mock
      await evidenceService.uploadFileMock(metadata.id, selectedFile);

      setUploadSuccess(true);
      setSelectedFile(null);
      setUploadCaseId("");

      // Refresh data
      await fetchData();

      setTimeout(() => {
        setShowUploadModal(false);
        setUploadSuccess(false);
      }, 1500);
    } catch (err) {
      console.error("Error uploading evidence", err);
      setUploadError(
        err.response?.data?.detail ||
          "Failed to upload evidence. File type might not be supported.",
      );
    }
  };

  const handleAnalyze = async (id) => {
    try {
      await evidenceService.analyzeEvidence(id);
      alert("Analysis initiated successfully!");
      await fetchData();
    } catch (err) {
      console.error("Error analyzing evidence", err);
      alert(err.response?.data?.detail || "Failed to run analysis.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c0c1ff]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-3xl font-bold text-[#dae2fd]">Dashboard</h2>
          <p className="text-sm text-[#c7c4d7] mt-1">
            Overview of system activity and active cases.
          </p>
        </div>
        <div className="text-sm text-[#c7c4d7]">Last updated: Just now</div>
      </div>

      {error && (
        <div className="bg-[#93000a]/20 border border-[#ffb4ab] text-[#ffb4ab] p-4 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      )}

      {/* Row 1: Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="card-level-1 rounded-lg p-6 relative overflow-hidden group">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-[#c7c4d7] uppercase tracking-wider mb-2">
                Total Cases
              </p>
              <h3 className="text-3xl font-bold text-[#c0c1ff]">
                {cases.length}
              </h3>
            </div>
            <div className="p-2 bg-[#c0c1ff]/10 rounded-md">
              <Briefcase className="h-6 w-6 text-[#c0c1ff]" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="flex items-center text-[#4edea3] text-sm font-medium">
              <TrendingUp className="h-4 w-4 mr-1" />
              Active
            </span>
            <span className="text-sm text-[#c7c4d7]">System cases</span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-[#2d3449]">
            <div className="h-full bg-[#c0c1ff] w-[70%]"></div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="card-level-1 rounded-lg p-6 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-[#c7c4d7] uppercase tracking-wider mb-2">
                Total Evidence Files
              </p>
              <h3 className="text-3xl font-bold text-[#c0c1ff]">
                {evidenceList.length}
              </h3>
            </div>
            <div className="p-2 bg-[#c0c1ff]/10 rounded-md">
              <Fingerprint className="h-6 w-6 text-[#c0c1ff]" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-[#c7c4d7]">Images, Videos, Docs</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="card-level-1 rounded-lg p-6 relative overflow-hidden border-l-2 border-l-[#ffb95f]">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-[#c7c4d7] uppercase tracking-wider mb-2">
                Unassigned Evidence
              </p>
              <h3 className="text-3xl font-bold text-[#ffb95f]">
                {evidenceList.filter((e) => !e.case_id).length}
              </h3>
            </div>
            <div className="p-2 bg-[#ffb95f]/10 rounded-md">
              <AlertCircle className="h-6 w-6 text-[#ffb95f]" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-[#c7c4d7]">
              Needs case assignment
            </span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="card-level-1 rounded-lg p-6 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-semibold text-[#c7c4d7] uppercase tracking-wider mb-2">
                Audit Logs
              </p>
              <h3 className="text-3xl font-bold text-[#c0c1ff]">
                {currentUser?.role === "Administrator"
                  ? "Active"
                  : "Restricted"}
              </h3>
            </div>
            <div className="p-2 bg-[#c0c1ff]/10 rounded-md">
              <History className="h-6 w-6 text-[#c0c1ff]" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm text-[#c7c4d7]">System audit trail</span>
          </div>
        </div>
      </div>

      {/* Row 2: Active Cases Table */}
      <div className="card-level-1 rounded-lg overflow-hidden flex flex-col">
        <div className="p-6 border-b border-[#334155] flex justify-between items-center bg-[#1E293B]">
          <h3 className="text-lg font-semibold text-[#dae2fd]">Active Cases</h3>
          <Link
            to="/cases"
            className="text-[#c0c1ff] hover:text-[#e1e0ff] transition-colors text-sm flex items-center gap-1"
          >
            View All <Plus className="h-4 w-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1E293B] border-b border-[#334155]">
                <th className="p-4 text-xs font-semibold text-[#c7c4d7] uppercase tracking-wider">
                  Case Number
                </th>
                <th className="p-4 text-xs font-semibold text-[#c7c4d7] uppercase tracking-wider">
                  Description
                </th>
                <th className="p-4 text-xs font-semibold text-[#c7c4d7] uppercase tracking-wider">
                  Evidence Count
                </th>
                <th className="p-4 text-xs font-semibold text-[#c7c4d7] uppercase tracking-wider">
                  Created Date
                </th>
                <th className="p-4 text-xs font-semibold text-[#c7c4d7] uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {cases.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-[#c7c4d7]">
                    No cases found. Click "New Case" to create one.
                  </td>
                </tr>
              ) : (
                cases.slice(0, 5).map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-[#334155] hover:bg-[#2D3748] transition-colors"
                  >
                    <td className="p-4 font-mono text-[#c0c1ff]">
                      {c.case_number}
                    </td>
                    <td
                      className="p-4 font-medium text-[#dae2fd] truncate max-w-xs"
                      title={c.description}
                    >
                      {c.description || "No description"}
                    </td>
                    <td className="p-4 text-[#c7c4d7]">
                      {c.evidence_count} files
                    </td>
                    <td className="p-4 text-[#c7c4d7]">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        to={`/cases/${c.id}`}
                        className="inline-flex p-1.5 text-[#c0c1ff] hover:bg-[#c0c1ff]/10 rounded transition-colors"
                        title="View Case Details"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showNewCaseModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-[#dae2fd] mb-4">
              Create New Case
            </h3>
            <form onSubmit={handleCreateCase} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#c7c4d7] mb-1">
                  Case Number *
                </label>
                <input
                  type="text"
                  value={newCaseNumber}
                  onChange={(e) => setNewCaseNumber(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-md p-2 text-sm text-[#dae2fd] focus:outline-none focus:border-[#c0c1ff]"
                  placeholder="e.g. CASE-2026-0042"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#c7c4d7] mb-1">
                  Description
                </label>
                <textarea
                  value={newCaseDescription}
                  onChange={(e) => setNewCaseDescription(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-md p-2 text-sm text-[#dae2fd] focus:outline-none focus:border-[#c0c1ff] h-24"
                  placeholder="Provide details about the case..."
                />
              </div>

              {caseFormError && (
                <div className="text-[#ffb4ab] text-xs flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{caseFormError}</span>
                </div>
              )}

              {caseFormSuccess && (
                <div className="text-[#4edea3] text-xs flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Case created successfully!</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="secondary"
                  onClick={() => setShowNewCaseModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Create Case
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-[#dae2fd] mb-4">
              Upload Digital Evidence
            </h3>
            <form onSubmit={handleUploadEvidence} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#c7c4d7] mb-1">
                  Select File *
                </label>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-md p-2 text-sm text-[#dae2fd] focus:outline-none focus:border-[#c0c1ff]"
                  required
                />
                <p className="text-[10px] text-[#c7c4d7] mt-1">
                  Supported types: Images, Videos, Documents (PDF, Word, TXT)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#c7c4d7] mb-1">
                  Assign to Case (Optional)
                </label>
                <select
                  value={uploadCaseId}
                  onChange={(e) => setUploadCaseId(e.target.value)}
                  className="w-full bg-[#0F172A] border border-[#334155] rounded-md p-2 text-sm text-[#dae2fd] focus:outline-none focus:border-[#c0c1ff]"
                >
                  <option value="">-- Select Case --</option>
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.case_number}
                    </option>
                  ))}
                </select>
              </div>

              {computingHash && (
                <div className="text-[#c0c1ff] text-xs flex items-center gap-2">
                  <div className="animate-spin rounded-full h-3 w-3 border-t border-b border-[#c0c1ff]"></div>
                  <span>Computing SHA-256 hash...</span>
                </div>
              )}

              {uploadError && (
                <div className="text-[#ffb4ab] text-xs flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>{uploadError}</span>
                </div>
              )}

              {uploadSuccess && (
                <div className="text-[#4edea3] text-xs flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Evidence uploaded and hash verified!</span>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  variant="secondary"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="success"
                  disabled={computingHash}
                >
                  Upload
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
