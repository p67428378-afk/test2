import React from "react";
import { Briefcase, FolderCheck, AlertTriangle, FileBox } from "lucide-react";

export default function CaseSummaryCard({ stats }) {
  const defaultStats = {
    active_cases: stats?.active_cases ?? 14,
    total_evidence_items: stats?.total_evidence_items ?? 128,
    pending_transfers: stats?.pending_transfers ?? 3,
    unassigned_artifacts: stats?.unassigned_artifacts ?? 5,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4 shadow-md">
        <div className="p-3 bg-blue-950/60 border border-blue-800/40 rounded-lg text-blue-400">
          <Briefcase className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-400">Active Cases</p>
          <p className="text-2xl font-bold text-slate-100">
            {defaultStats.active_cases}
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4 shadow-md">
        <div className="p-3 bg-emerald-950/60 border border-emerald-800/40 rounded-lg text-emerald-400">
          <FolderCheck className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-400">Total Evidence Items</p>
          <p className="text-2xl font-bold text-slate-100">
            {defaultStats.total_evidence_items}
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4 shadow-md">
        <div className="p-3 bg-amber-950/60 border border-amber-800/40 rounded-lg text-amber-400">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-400">Pending Custody Transfers</p>
          <p className="text-2xl font-bold text-amber-400">
            {defaultStats.pending_transfers}
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-4 shadow-md">
        <div className="p-3 bg-purple-950/60 border border-purple-800/40 rounded-lg text-purple-400">
          <FileBox className="w-6 h-6" />
        </div>
        <div>
          <p className="text-xs text-slate-400">Unassigned Artifacts</p>
          <p className="text-2xl font-bold text-blue-400">
            {defaultStats.unassigned_artifacts}
          </p>
        </div>
      </div>
    </div>
  );
}
