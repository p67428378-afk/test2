import React, { useState, useEffect } from "react";
import { listEntryExitLogs } from "../services/api";
import {
  History,
  Search,
  ShieldCheck,
  FileSpreadsheet,
  RefreshCw,
  Calendar,
  Clock,
} from "lucide-react";

const VisitorHistoryTable = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeOnly, setActiveOnly] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [activeOnly]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await listEntryExitLogs({ active_only: activeOnly });
      setLogs(data || []);
    } catch (err) {
      console.error("Error fetching visitor history:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter((log) => {
    const term = searchTerm.toLowerCase();
    const visitorName =
      log.appointment?.visitor?.full_name?.toLowerCase() || "";
    const inmateName = log.appointment?.inmate?.full_name?.toLowerCase() || "";
    const aptId = log.appointment_id?.toLowerCase() || "";
    return (
      visitorName.includes(term) ||
      inmateName.includes(term) ||
      aptId.includes(term)
    );
  });

  const calculateDuration = (inTime, outTime) => {
    if (!inTime) return "N/A";
    if (!outTime) return "In Progress";
    const start = new Date(inTime);
    const end = new Date(outTime);
    const diffMins = Math.round((end - start) / (1000 * 60));
    return `${diffMins} mins`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 mb-4 border-b border-slate-100 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-purple-50 text-purple-800 rounded-lg">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Visitor History & Immutable Audit Log
            </h2>
            <p className="text-sm text-slate-500">
              Cryptographically verifiable entry/exit records & visitation
              compliance audit
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={fetchHistory}
            className="p-2 text-slate-600 hover:text-slate-900 border border-slate-300 rounded-lg hover:bg-slate-50 transition"
            title="Refresh Audit Log"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search history by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <label className="flex items-center space-x-2 text-xs font-semibold text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={activeOnly}
              onChange={(e) => setActiveOnly(e.target.checked)}
              className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
            />
            <span>Active Visits Only</span>
          </label>
        </div>
      </div>

      <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>
            <strong className="font-semibold text-slate-700">
              Audit Compliance Notice:
            </strong>{" "}
            Historical records are read-only and immutable. Logs cannot be
            modified or purged.
          </span>
        </div>
        <div className="font-mono text-slate-400">
          AES-256 / SHA-256 Enabled
        </div>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500 text-sm">
          Retrieving audit log history...
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="py-12 text-center text-slate-400 text-sm">
          No historical visitation records found matching filter.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <th className="p-3">Log ID</th>
                <th className="p-3">Visitor Name</th>
                <th className="p-3">Inmate Visited</th>
                <th className="p-3">Check-In Timestamp</th>
                <th className="p-3">Check-Out Timestamp</th>
                <th className="p-3">Duration</th>
                <th className="p-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono text-xs text-slate-500">
                    {log.id.substring(0, 8)}...
                  </td>
                  <td className="p-3 font-medium text-slate-800">
                    {log.appointment?.visitor?.full_name || "N/A"}
                  </td>
                  <td className="p-3 text-slate-700">
                    {log.appointment?.inmate?.full_name || "N/A"}
                  </td>
                  <td className="p-3 text-slate-600 font-mono text-xs">
                    {log.check_in_time
                      ? new Date(log.check_in_time).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="p-3 text-slate-600 font-mono text-xs">
                    {log.check_out_time
                      ? new Date(log.check_out_time).toLocaleString()
                      : "Pending Exit"}
                  </td>
                  <td className="p-3 text-slate-600 font-semibold text-xs">
                    {calculateDuration(log.check_in_time, log.check_out_time)}
                  </td>
                  <td className="p-3 text-right">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                        log.check_out_time
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {log.check_out_time ? "Completed" : "On-Site Active"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VisitorHistoryTable;
