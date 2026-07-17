import React from "react";
import { Filter, AlertTriangle, CheckCircle } from "lucide-react";

export default function ValidationLogsTable({ logs }) {
  return (
    <div className="bg-[#1E293B] border border-[#334155] rounded overflow-hidden">
      <div className="p-4 border-b border-[#334155] bg-[#171f33] flex justify-between items-center">
        <h2 className="text-sm font-semibold text-[#F8FAFC]">
          Compatibility Validation Logs
        </h2>
        <button className="text-xs text-[#94A3B8] hover:text-[#10b981] flex items-center gap-1 transition-colors">
          <Filter className="w-4 h-4" />
          <span>Filter</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr class="bg-[#1E293B] border-b border-[#334155]">
              <th className="py-3 px-4 text-[11px] uppercase tracking-wider text-[#94A3B8] font-semibold w-[180px]">
                Timestamp
              </th>
              <th className="py-3 px-4 text-[11px] uppercase tracking-wider text-[#94A3B8] font-semibold">
                Subject
              </th>
              <th className="py-3 px-4 text-[11px] uppercase tracking-wider text-[#94A3B8] font-semibold">
                Attempted Version
              </th>
              <th className="py-3 px-4 text-[11px] uppercase tracking-wider text-[#94A3B8] font-semibold w-[35%]">
                Change Type
              </th>
              <th className="py-3 px-4 text-[11px] uppercase tracking-wider text-[#94A3B8] font-semibold">
                Compatibility
              </th>
              <th className="py-3 px-4 text-[11px] uppercase tracking-wider text-[#94A3B8] font-semibold text-right">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="text-xs text-[#E2E8F0]">
            {logs.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-[#94A3B8]">
                  No validation logs found.
                </td>
              </tr>
            ) : (
              logs.map((log) => {
                const isFailed = log.status === "FAILED";
                return (
                  <tr
                    key={log.id}
                    className={`border-b border-[#334155] hover:bg-[#2D3748]/50 transition-colors ${
                      isFailed ? "bg-[#ffb4ab]/5 hover:bg-[#ffb4ab]/10" : ""
                    }`}
                  >
                    <td className="py-3 px-4 text-[#94A3B8] font-mono">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-medium">{log.subject}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-[#0F172A] border border-[#334155] rounded text-[11px]">
                        {log.attempted_version}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="text-[#E2E8F0]">
                          {log.change_type}
                        </span>
                        {isFailed && log.error_details && (
                          <span className="text-[#ffb4ab] text-[11px] mt-1 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            <span>{log.error_details}</span>
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">{log.compatibility_level}</td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          isFailed
                            ? "bg-[#ffb4ab]/10 text-[#ffb4ab] border-[#ffb4ab]/20"
                            : "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
