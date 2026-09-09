import React from "react";
import { ShieldCheck, FileText, Trash2 } from "lucide-react";
import Badge from "../common/Badge";

export default function LinkedEvidenceTable({
  evidenceItems,
  onUnassign,
  caseNumber = "CASE-2026-089",
}) {
  const defaultItems = [
    {
      id: "ev-1001",
      evidence_code: "EVID-1001",
      file_name: "Forensic_Report.pdf",
      file_type: "Document / PDF",
      sha256_hash: "7d4a2f8b1c4e91c28f34a021021bc34e91c",
      current_custodian: { full_name: "Inv. Alice" },
      status: "Verified",
    },
    {
      id: "ev-1002",
      evidence_code: "EVID-1002",
      file_name: "dashcam_footage.mp4",
      file_type: "Video / MP4",
      sha256_hash:
        "a5f18c0e2b4d9627e36980db1c149afbf4c8996fb92427ae41e4649b934ca495",
      current_custodian: { full_name: "Lead Prosecutor Bob" },
      status: "Verified",
    },
  ];

  const itemsToDisplay = evidenceItems ?? defaultItems;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          <span>Case Dossier Linked Evidence ({itemsToDisplay.length})</span>
        </h3>
        <Badge variant="info">{caseNumber}</Badge>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950 text-slate-400 text-xs uppercase border-b border-slate-800">
            <tr>
              <th className="p-3">Evidence Code</th>
              <th className="p-3">File Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">SHA-256 Hash</th>
              <th className="p-3">Custodian</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {itemsToDisplay.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="p-8 text-center text-xs text-slate-400 font-mono"
                >
                  No evidence items currently linked to this case dossier.
                </td>
              </tr>
            ) : (
              itemsToDisplay.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-slate-800/50 transition-colors"
                >
                  <td className="p-3 font-mono font-semibold text-blue-400">
                    {item.evidence_code}
                  </td>
                  <td className="p-3 font-medium text-slate-200">
                    {item.file_name}
                  </td>
                  <td className="p-3 text-xs text-slate-400">
                    {item.file_type}
                  </td>
                  <td
                    className="p-3 font-mono text-xs text-slate-400 truncate max-w-[150px]"
                    title={item.sha256_hash}
                  >
                    {item.sha256_hash
                      ? `${item.sha256_hash.slice(0, 8)}...${item.sha256_hash.slice(-6)}`
                      : "N/A"}
                  </td>
                  <td className="p-3 text-slate-300">
                    {item.current_custodian?.full_name ||
                      item.current_custodian?.email ||
                      "Unassigned"}
                  </td>
                  <td className="p-3">
                    <Badge variant="success">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Verified</span>
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    {onUnassign && (
                      <button
                        onClick={() => onUnassign(item.id)}
                        className="text-slate-400 hover:text-red-400 p-1 rounded hover:bg-slate-800 transition-colors"
                        title="Unassign from case"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
