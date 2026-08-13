import React from "react";
import { History, ShieldAlert, CheckCircle } from "lucide-react";

export default function GateScanAuditLog({ auditLogs = [] }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-indigo-400" /> Live Gate Scan Audit
          Trail
        </h2>
        <span className="text-xs text-slate-400">
          Anti-Passback Duplicate Protection Log
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Ticket Code</th>
              <th className="px-4 py-3">Gate</th>
              <th className="px-4 py-3">Tier</th>
              <th className="px-4 py-3">Scan Latency</th>
              <th className="px-4 py-3 text-right">Result</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-mono">
            {auditLogs.map((log, idx) => (
              <tr key={idx} className="hover:bg-slate-800/50 transition">
                <td className="px-4 py-3 text-slate-400">{log.scanned_at}</td>
                <td className="px-4 py-3 text-white font-bold">
                  {log.ticket_code}
                </td>
                <td className="px-4 py-3 text-slate-300 font-sans">
                  {log.gate_name}
                </td>
                <td className="px-4 py-3 text-slate-400 font-sans">
                  {log.tier}
                </td>
                <td className="px-4 py-3 text-indigo-400">
                  {log.latency_ms} ms
                </td>
                <td className="px-4 py-3 text-right font-sans">
                  {log.status === "VALID" ? (
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                      VALID ENTRY
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[10px] font-bold flex items-center gap-1 justify-end ml-auto w-max">
                      <ShieldAlert className="w-3 h-3" /> REJECTED / DUP
                    </span>
                  )}
                </td>
              </tr>
            ))}

            {auditLogs.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-8 text-center text-slate-500 font-sans"
                >
                  No gate scan activity recorded in this session.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
