import React from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  FileText,
  Image,
  Video,
  Link as LinkIcon,
  Cpu,
} from "lucide-react";
import Badge from "../common/Badge.jsx";

export default function EvidenceTable({
  evidenceList,
  onAssignClick,
  onAnalyzeClick,
  cases = [],
}) {
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

  const getCaseNumber = (caseId) => {
    if (!caseId) return null;
    const foundCase = cases.find((c) => c.id === caseId);
    return foundCase ? foundCase.case_number : "Assigned";
  };

  return (
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
              Case Assignment
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
          {evidenceList.length === 0 ? (
            <tr>
              <td colSpan="7" className="p-8 text-center text-[#c7c4d7]">
                No evidence files found.
              </td>
            </tr>
          ) : (
            evidenceList.map((evidence) => (
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
                <td className="p-4">
                  {evidence.case_id ? (
                    <Badge variant="success">
                      {getCaseNumber(evidence.case_id)}
                    </Badge>
                  ) : (
                    <Badge variant="warning">Unassigned</Badge>
                  )}
                </td>
                <td className="p-4 text-[#c7c4d7]">
                  {new Date(evidence.created_at).toLocaleString()}
                </td>
                <td className="p-4 text-right space-x-2">
                  <Link
                    to={`/evidence/${evidence.id}`}
                    className="inline-flex p-1.5 text-[#c0c1ff] hover:bg-[#c0c1ff]/10 rounded transition-colors"
                    title="View Details & Chain of Custody"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>

                  {!evidence.case_id && onAssignClick && (
                    <button
                      onClick={() => onAssignClick(evidence)}
                      className="inline-flex p-1.5 text-[#4edea3] hover:bg-[#4edea3]/10 rounded transition-colors"
                      title="Assign to Case"
                    >
                      <LinkIcon className="h-4 w-4" />
                    </button>
                  )}

                  {onAnalyzeClick && (
                    <button
                      onClick={() => onAnalyzeClick(evidence.id)}
                      className="inline-flex p-1.5 text-[#ffb95f] hover:bg-[#ffb95f]/10 rounded transition-colors"
                      title="Run Analysis"
                    >
                      <Cpu className="h-4 w-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
