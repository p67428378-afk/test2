import React from "react";
import { Landmark, RefreshCw, Clock, AlertTriangle } from "lucide-react";

const SweepOverviewCard = ({ rules }) => {
  const activeCount = rules.filter(
    (r) => r.status === "APPROVED" || r.status === "ACTIVE",
  ).length;
  const pendingCount = rules.filter(
    (r) => r.status === "PENDING_APPROVAL",
  ).length;
  const pausedCount = rules.filter((r) => r.status === "PAUSED").length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bento-card p-5 rounded-xl">
        <div className="flex justify-between items-start mb-4">
          <span className="text-label-md font-label-md text-on-surface-variant">
            Total Liquidity
          </span>
          <Landmark className="text-indigo-accent opacity-50 w-5 h-5" />
        </div>
        <div className="flex items-end gap-2">
          <h2 className="text-headline-md font-headline-md">$45.2M</h2>
          <span className="text-green-400 text-label-md flex items-center gap-0.5 pb-1">
            4.5%
          </span>
        </div>
      </div>

      <div className="bento-card p-5 rounded-xl">
        <div className="flex justify-between items-start mb-4">
          <span className="text-label-md font-label-md text-on-surface-variant">
            Active Rules
          </span>
          <RefreshCw className="text-indigo-accent opacity-50 w-5 h-5" />
        </div>
        <div className="flex items-end gap-2">
          <h2 className="text-headline-md font-headline-md">{activeCount}</h2>
        </div>
      </div>

      <div className="bento-card p-5 rounded-xl">
        <div className="flex justify-between items-start mb-4">
          <span className="text-label-md font-label-md text-on-surface-variant">
            Pending Approvals
          </span>
          <Clock className="text-indigo-accent opacity-50 w-5 h-5" />
        </div>
        <div className="flex items-center gap-3">
          <h2 className="text-headline-md font-headline-md">{pendingCount}</h2>
          {pendingCount > 0 && (
            <span className="bg-yellow-900/20 text-yellow-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              Attention Required
            </span>
          )}
        </div>
      </div>

      <div className="bento-card p-5 rounded-xl">
        <div className="flex justify-between items-start mb-4">
          <span className="text-label-md font-label-md text-on-surface-variant">
            Paused Workflows
          </span>
          <AlertTriangle className="text-indigo-accent opacity-50 w-5 h-5" />
        </div>
        <div className="flex items-center gap-3">
          <h2 className="text-headline-md font-headline-md">{pausedCount}</h2>
          {pausedCount > 0 && (
            <span className="bg-blue-900/20 text-blue-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
              Paused
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SweepOverviewCard;
