import React from "react";

export default function StatsBar({ total, completed, pending }) {
  return (
    <div className="flex gap-4">
      <div className="task-card px-4 py-2 rounded-lg border border-[#464554] flex items-center gap-2 bg-[#171f33]">
        <span className="text-xs text-[#c7c4d7]">Total Tasks</span>
        <span className="text-sm font-semibold text-[#dae2fd] bg-[#222a3d] px-2 py-0.5 rounded-full">
          {total}
        </span>
      </div>
      <div className="task-card px-4 py-2 rounded-lg border border-[#464554] flex items-center gap-2 bg-[#171f33]">
        <span className="text-xs text-[#c7c4d7]">Completed</span>
        <span className="text-sm font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
          {completed}
        </span>
      </div>
      <div className="task-card px-4 py-2 rounded-lg border border-[#464554] flex items-center gap-2 bg-[#171f33]">
        <span className="text-xs text-[#c7c4d7]">Pending</span>
        <span className="text-sm font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
          {pending}
        </span>
      </div>
    </div>
  );
}
