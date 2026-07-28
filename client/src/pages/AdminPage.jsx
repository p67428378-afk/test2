import React, { useState, useEffect } from "react";
import { Shield, History, Users, AlertCircle, Clock } from "lucide-react";
import { auditService, authService } from "../services/api";
import Badge from "../components/common/Badge.jsx";

export default function AdminPage() {
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    const fetchLogs = async () => {
      if (currentUser && currentUser.role !== "Administrator") {
        setError("Access denied. Administrator role required.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const logs = await auditService.getAuditLogs();
        setAuditLogs(logs);
        setError(null);
      } catch (err) {
        console.error("Error fetching audit logs", err);
        setError("Failed to load system audit logs.");
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c0c1ff]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#93000a]/20 border border-[#ffb4ab] text-[#ffb4ab] p-4 rounded-lg flex items-center gap-3">
        <AlertCircle className="h-5 w-5" />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-end mb-2">
        <div>
          <h2 className="text-3xl font-bold text-[#dae2fd]">Admin Panel</h2>
          <p className="text-sm text-[#c7c4d7] mt-1">
            System audit logs and administrative controls.
          </p>
        </div>
        <Badge variant="danger">Admin Only</Badge>
      </div>

      {/* Audit Logs Section */}
      <div className="card-level-1 rounded-lg overflow-hidden flex flex-col">
        <div className="p-6 border-b border-[#334155] flex items-center gap-2 bg-[#1E293B]">
          <History className="h-5 w-5 text-[#c0c1ff]" />
          <h3 className="text-lg font-semibold text-[#dae2fd]">
            System Audit Logs
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1E293B] border-b border-[#334155]">
                <th className="p-4 text-xs font-semibold text-[#c7c4d7] uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="p-4 text-xs font-semibold text-[#c7c4d7] uppercase tracking-wider">
                  User
                </th>
                <th className="p-4 text-xs font-semibold text-[#c7c4d7] uppercase tracking-wider">
                  Action
                </th>
                <th className="p-4 text-xs font-semibold text-[#c7c4d7] uppercase tracking-wider">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-[#c7c4d7]">
                    No audit logs found.
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-[#334155] hover:bg-[#2D3748] transition-colors"
                  >
                    <td className="p-4 text-[#c7c4d7] whitespace-nowrap flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-[#c7c4d7]/70" />
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 font-medium text-[#dae2fd]">
                      {log.username || "System"}
                    </td>
                    <td className="p-4">
                      <Badge
                        variant={
                          log.action.includes("FAIL") ||
                          log.action.includes("DENIED")
                            ? "danger"
                            : "info"
                        }
                      >
                        {log.action}
                      </Badge>
                    </td>
                    <td className="p-4 font-mono text-xs text-[#c7c4d7]">
                      {log.details ? (
                        <div
                          className="max-w-md truncate"
                          title={JSON.stringify(log.details)}
                        >
                          {JSON.stringify(log.details)}
                        </div>
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
