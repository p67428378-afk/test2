import React, { useState } from "react";
import {
  Activity,
  ShieldAlert,
  CheckCircle,
  Search,
  Filter,
  Eye,
} from "lucide-react";
import Badge from "../common/Badge";

export default function AuditLogTable({
  logs = [],
  total = 0,
  onFilterChange,
}) {
  const [selectedLog, setSelectedLog] = useState(null);
  const [filterAction, setFilterAction] = useState("");
  const [filterEmail, setFilterEmail] = useState("");

  const defaultLogs = [
    {
      id: "aud-1001",
      timestamp: "2026-05-18T14:32:00Z",
      user_email: "charlie@police.gov",
      action: "EVIDENCE_VIEW",
      resource: "EVID-1005",
      status_code: 403,
      ip_address: "192.168.1.45",
      details: {
        reason: "Unauthorized role attempt on restricted case",
        role: "Investigator",
      },
    },
    {
      id: "aud-1002",
      timestamp: "2026-05-18T14:30:00Z",
      user_email: "alice@police.gov",
      action: "TRANSFER_SIGN_OFF",
      resource: "EVID-1002",
      status_code: 200,
      ip_address: "10.42.108.19",
      details: {
        new_custodian: "bob@prosecution.gov",
        reason: "Court Presentation",
      },
    },
    {
      id: "aud-1003",
      timestamp: "2026-05-18T10:15:00Z",
      user_email: "alice@police.gov",
      action: "EVIDENCE_UPLOAD",
      resource: "EVID-1002",
      status_code: 201,
      ip_address: "10.42.108.19",
      details: {
        file_name: "dashcam_footage.mp4",
        sha256_hash: "a5f18c0e2b4d9627...",
      },
    },
  ];

  const displayLogs = logs.length > 0 ? logs : defaultLogs;

  const handleApplyFilter = () => {
    if (onFilterChange) {
      onFilterChange({ action: filterAction, user_email: filterEmail });
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            <span>Tamper-Evident System Audit Log Viewer</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Append-only audit trail intercepting all system actions and
            authorization checks
          </p>
        </div>
        <Badge variant="purple">
          <ShieldAlert className="w-3.5 h-3.5" />
          <span>CRYPTOGRAPHICALLY SEALED LOGS</span>
        </Badge>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-950 p-3 rounded-lg border border-slate-800">
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">
            Filter by Action
          </label>
          <input
            type="text"
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            placeholder="e.g. EVIDENCE_VIEW, TRANSFER"
            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] text-slate-400 mb-1">
            Filter by User Email
          </label>
          <input
            type="text"
            value={filterEmail}
            onChange={(e) => setFilterEmail(e.target.value)}
            placeholder="e.g. charlie@police.gov"
            className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div className="flex items-end">
          <button
            onClick={handleApplyFilter}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium py-1.5 rounded transition-colors flex items-center justify-center gap-1.5"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Apply Audit Filter</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950 text-slate-400 text-xs uppercase border-b border-slate-800">
            <tr>
              <th className="p-3">Timestamp (UTC)</th>
              <th className="p-3">User Email</th>
              <th className="p-3">Action</th>
              <th className="p-3">Target Resource</th>
              <th className="p-3">Status</th>
              <th className="p-3">IP Address</th>
              <th className="p-3 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {displayLogs.map((log) => {
              const isDenied = log.status_code >= 400;
              return (
                <tr
                  key={log.id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="p-3 font-mono text-xs text-slate-400">
                    {log.timestamp}
                  </td>
                  <td className="p-3 font-semibold text-slate-200">
                    {log.user_email}
                  </td>
                  <td
                    className={`p-3 font-mono text-xs ${isDenied ? "text-red-400" : "text-emerald-400"}`}
                  >
                    {log.action}
                  </td>
                  <td className="p-3 font-mono text-xs text-blue-400">
                    {log.resource}
                  </td>
                  <td className="p-3">
                    <Badge variant={isDenied ? "danger" : "success"}>
                      {isDenied
                        ? `${log.status_code} FORBIDDEN`
                        : `${log.status_code} OK`}
                    </Badge>
                  </td>
                  <td className="p-3 font-mono text-xs text-slate-400">
                    {log.ip_address}
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedLog(log)}
                      className="text-slate-400 hover:text-blue-400 p-1 rounded hover:bg-slate-800 transition-colors"
                      title="Inspect Log JSON"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* JSON Inspector Drawer */}
      {selectedLog && (
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="text-xs font-bold font-mono text-blue-400">
              Log Entry Raw Payload: {selectedLog.id}
            </h4>
            <button
              onClick={() => setSelectedLog(null)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Close
            </button>
          </div>
          <pre className="text-xs font-mono text-slate-300 bg-slate-900 p-3 rounded overflow-x-auto">
            {JSON.stringify(selectedLog, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
