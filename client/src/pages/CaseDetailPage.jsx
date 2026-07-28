import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  FileText,
  Image,
  Video,
  Eye,
  Link as LinkIcon,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { caseService, evidenceService } from "../services/api";
import Badge from "../components/common/Badge.jsx";
import Button from "../components/common/Button.jsx";

export default function CaseDetailPage({ cases, evidenceList, fetchData }) {
  const { id } = useParams();
  const [currentCase, setCurrentCase] = useState(null);
  const [caseEvidence, setCaseEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Assign evidence state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignError, setAssignError] = useState(null);
  const [assignSuccess, setAssignSuccess] = useState(false);

  useEffect(() => {
    const loadCaseDetails = async () => {
      try {
        setLoading(true);
        // Find case in cases list
        const foundCase = cases.find((c) => c.id === id);
        if (foundCase) {
          setCurrentCase(foundCase);
        } else {
          setError("Case not found.");
          setLoading(false);
          return;
        }

        // Fetch evidence for this case
        const evidence = await caseService.getCaseEvidence(id);
        setCaseEvidence(evidence);
        setError(null);
      } catch (err) {
        console.error("Error loading case details", err);
        setError("Failed to load case details.");
      } finally {
        setLoading(false);
      }
    };

    loadCaseDetails();
  }, [id, cases, evidenceList]);

  const handleAssignEvidence = async (evidenceId) => {
    setAssignError(null);
    setAssignSuccess(false);
    try {
      await caseService.assignEvidence(id, evidenceId);
      setAssignSuccess(true);
      await fetchData();
      setTimeout(() => {
        setShowAssignModal(false);
        setAssignSuccess(false);
      }, 1000);
    } catch (err) {
      console.error("Error assigning evidence", err);
      setAssignError(
        err.response?.data?.detail || "Failed to assign evidence.",
      );
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (type) => {
    const lowerType = type.toLowerCase();
    if (lowerType.includes("image"))
      return <Image className="h-4 w-4 text-[#4edea3]" />;
    if (lowerType.includes("video"))
      return <Video className="h-4 w-4 text-[#ffb95f]" />;
    return <FileText className="h-4 w-4 text-[#c0c1ff]" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c0c1ff]"></div>
      </div>
    );
  }

  if (error || !currentCase) {
    return (
      <div className="space-y-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#c0c1ff] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <div className="bg-[#93000a]/20 border border-[#ffb4ab] text-[#ffb4ab] p-4 rounded-lg flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <span>{error || "Case not found."}</span>
        </div>
      </div>
    );
  }

  const unassignedEvidence = evidenceList.filter((e) => !e.case_id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#c0c1ff] hover:underline text-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#c0c1ff]/10 rounded-lg">
              <Briefcase className="h-8 w-8 text-[#c0c1ff]" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-[#dae2fd] font-mono">
                {currentCase.case_number}
              </h2>
              <p className="text-sm text-[#c7c4d7] mt-1">
                Case Details & Assigned Evidence
              </p>
            </div>
          </div>
          <Button variant="primary" onClick={() => setShowAssignModal(true)}>
            <LinkIcon className="h-4 w-4" /> Assign Evidence
          </Button>
        </div>
      </div>

      {/* Case Info Card */}
      <div className="card-level-1 rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-[#c0c1ff]">
          Case Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-[#c7c4d7] font-medium">Case Number</p>
            <p className="text-[#dae2fd] font-mono mt-1">
              {currentCase.case_number}
            </p>
          </div>
          <div>
            <p className="text-[#c7c4d7] font-medium">Created Date</p>
            <p className="text-[#dae2fd] mt-1">
              {new Date(currentCase.created_at).toLocaleString()}
            </p>
          </div>
          <div className="md:col-span-2">
            <p className="text-[#c7c4d7] font-medium">Description</p>
            <p className="text-[#dae2fd] mt-1 bg-[#0F172A] p-3 rounded border border-[#334155]">
              {currentCase.description || "No description provided."}
            </p>
          </div>
        </div>
      </div>

      {/* Assigned Evidence Table */}
      <div className="card-level-1 rounded-lg overflow-hidden flex flex-col">
        <div className="p-6 border-b border-[#334155] bg-[#1E293B]">
          <h3 className="text-lg font-semibold text-[#dae2fd]">
            Assigned Evidence ({caseEvidence.length})
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1E293B] border-b border-[#334155]">
                <th className="p-4 text-xs font-semibold text-[#c7c4d7] uppercase tracking-wider">
                  Filename
                </th>
                <th className="p-4 text-xs font-semibold text-[#c7c4d7] uppercase tracking-wider">
                  Type
                </th>
                <th className="p-4 text-xs font-semibold text-[#c7c4d7] uppercase tracking-wider">
                  Size
                </th>
                <th className="p-4 text-xs font-semibold text-[#c7c4d7] uppercase tracking-wider">
                  SHA-256 Hash
                </th>
                <th className="p-4 text-xs font-semibold text-[#c7c4d7] uppercase tracking-wider">
                  Uploaded By
                </th>
                <th className="p-4 text-xs font-semibold text-[#c7c4d7] uppercase tracking-wider">
                  Uploaded At
                </th>
                <th className="p-4 text-xs font-semibold text-[#c7c4d7] uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {caseEvidence.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-[#c7c4d7]">
                    No evidence assigned to this case yet.
                  </td>
                </tr>
              ) : (
                caseEvidence.map((evidence) => (
                  <tr
                    key={evidence.id}
                    className="border-b border-[#334155] hover:bg-[#2D3748] transition-colors"
                  >
                    <td className="p-4 font-medium text-[#dae2fd]">
                      <div className="flex items-center gap-2">
                        {getFileIcon(evidence.file_type)}
                        <span
                          className="truncate max-w-xs"
                          title={evidence.filename}
                        >
                          {evidence.filename}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-[#c7c4d7]">{evidence.file_type}</td>
                    <td className="p-4 text-[#c7c4d7]">
                      {formatBytes(evidence.file_size)}
                    </td>
                    <td
                      className="p-4 font-mono text-xs text-[#c7c4d7]"
                      title={evidence.sha256_hash}
                    >
                      {evidence.sha256_hash
                        ? `${evidence.sha256_hash.substring(0, 10)}...`
                        : "N/A"}
                    </td>
                    <td className="p-4 text-[#c7c4d7]">
                      {evidence.uploaded_by}
                    </td>
                    <td className="p-4 text-[#c7c4d7]">
                      {new Date(evidence.created_at).toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        to={`/evidence/${evidence.id}`}
                        className="inline-flex p-1.5 text-[#c0c1ff] hover:bg-[#c0c1ff]/10 rounded transition-colors"
                        title="View Details & Chain of Custody"
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

      {/* Assign Evidence Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1E293B] border border-[#334155] rounded-xl p-6 w-full max-w-lg shadow-2xl">
            <h3 className="text-xl font-bold text-[#dae2fd] mb-4">
              Assign Evidence to Case
            </h3>

            {assignError && (
              <div className="bg-[#93000a]/20 border border-[#ffb4ab] text-[#ffb4ab] p-3 rounded-lg flex items-center gap-2 mb-4 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{assignError}</span>
              </div>
            )}

            {assignSuccess && (
              <div className="bg-[#00a572]/20 border border-[#4edea3] text-[#4edea3] p-3 rounded-lg flex items-center gap-2 mb-4 text-sm">
                <CheckCircle2 className="h-4 w-4" />
                <span>Evidence assigned successfully!</span>
              </div>
            )}

            <div className="max-h-60 overflow-y-auto border border-[#334155] rounded-md divide-y divide-[#334155]">
              {unassignedEvidence.length === 0 ? (
                <p className="p-4 text-center text-sm text-[#c7c4d7]">
                  No unassigned evidence files available.
                </p>
              ) : (
                unassignedEvidence.map((evidence) => (
                  <div
                    key={evidence.id}
                    className="p-3 flex justify-between items-center hover:bg-[#2D3748] transition-colors"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {getFileIcon(evidence.file_type)}
                      <div className="truncate">
                        <p
                          className="text-sm font-medium text-[#dae2fd] truncate"
                          title={evidence.filename}
                        >
                          {evidence.filename}
                        </p>
                        <p className="text-xs text-[#c7c4d7]">
                          {formatBytes(evidence.file_size)} •{" "}
                          {evidence.file_type}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="success"
                      onClick={() => handleAssignEvidence(evidence.id)}
                      className="px-3 py-1 text-xs"
                    >
                      Assign
                    </Button>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-[#334155]">
              <Button
                variant="secondary"
                onClick={() => setShowAssignModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
