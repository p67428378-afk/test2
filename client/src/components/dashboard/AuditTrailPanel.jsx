import React from "react";
import { History, ShieldCheck, UserCheck, FileCheck } from "lucide-react";

export default function AuditTrailPanel() {
  const auditLogs = [
    {
      id: "AUD-2026-8891",
      timestamp: "2026-08-05 00:00:00 UTC",
      manager: "Aarchi Jain (Category Manager)",
      cluster: "Small Town Value Cluster",
      scenario: "Balanced",
      summary: "12 Keeps, 3 Swaps, 2 Reduces",
      guardrails: "3/3 Passed",
      status: "APPROVED_AND_LOGGED",
    },
    {
      id: "AUD-2026-7102",
      timestamp: "2026-07-15 14:30:22 UTC",
      manager: "Aarchi Jain (Category Manager)",
      cluster: "Small Town Value Cluster",
      scenario: "Conservative",
      summary: "15 Keeps, 1 Swap, 1 Reduce",
      guardrails: "3/3 Passed",
      status: "COMPLETED",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 space-y-2">
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <History className="h-5 w-5 text-amber-500" />
          Assortment Recommendation Audit Logs
        </h2>
        <p className="text-xs text-slate-400">
          Historical record of submitted assortment decisions, scenario
          selections, and automated guardrail compliance checks.
        </p>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 border-b border-slate-700 text-xs font-semibold text-slate-400 uppercase">
              <th className="p-3">Audit Ref ID</th>
              <th className="p-3">Timestamp</th>
              <th className="p-3">Submitted By</th>
              <th className="p-3">Scenario</th>
              <th className="p-3">Action Summary</th>
              <th className="p-3">Guardrails</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="text-xs divide-y divide-slate-700/50">
            {auditLogs.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-slate-700/30 transition-colors"
              >
                <td className="p-3 font-mono text-amber-400 font-bold">
                  {log.id}
                </td>
                <td className="p-3 text-slate-300">{log.timestamp}</td>
                <td className="p-3 text-slate-200">{log.manager}</td>
                <td className="p-3 font-semibold text-slate-100">
                  {log.scenario}
                </td>
                <td className="p-3 text-slate-300">{log.summary}</td>
                <td className="p-3">
                  <span className="bg-emerald-900/30 text-emerald-400 border border-emerald-800/50 px-2 py-0.5 rounded text-[10px] font-bold">
                    {log.guardrails}
                  </span>
                </td>
                <td className="p-3">
                  <span className="bg-blue-900/30 text-blue-400 border border-blue-800/50 px-2 py-0.5 rounded text-[10px] font-bold">
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
