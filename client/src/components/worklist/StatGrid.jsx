import React from "react";

export default function StatGrid({ tasks }) {
  const total = tasks.length;
  const todo = tasks.filter((t) => t.status === "To Do").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const done = tasks.filter((t) => t.status === "Done").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-stack-md mb-stack-lg mt-4">
      {/* Total Tasks */}
      <div className="bg-[#1E293B] rounded-xl p-4 border border-[#334155] flex flex-col gap-1 hover:border-primary-container transition-colors group relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-container/0 group-hover:bg-primary-container/5 transition-colors pointer-events-none"></div>
        <span className="font-label-md text-label-md text-on-surface-variant">
          Total Tasks
        </span>
        <span className="font-title-lg text-title-lg font-semibold text-on-surface">
          {total}
        </span>
      </div>

      {/* To Do */}
      <div className="bg-[#1E293B] rounded-xl p-4 border border-[#334155] flex flex-col gap-1 hover:border-tertiary-container transition-colors group relative overflow-hidden">
        <div className="absolute inset-0 bg-tertiary-container/0 group-hover:bg-tertiary-container/5 transition-colors pointer-events-none"></div>
        <span className="font-label-md text-label-md text-on-surface-variant">
          To Do
        </span>
        <div className="flex items-center gap-2">
          <span className="font-title-lg text-title-lg font-semibold text-on-surface">
            {todo}
          </span>
          <span className="bg-tertiary-container/10 text-tertiary-fixed-dim px-2 py-0.5 rounded font-label-sm text-label-sm border border-tertiary-container/20">
            Amber
          </span>
        </div>
      </div>

      {/* In Progress */}
      <div className="bg-[#1E293B] rounded-xl p-4 border border-[#334155] flex flex-col gap-1 hover:border-primary-fixed-dim transition-colors group relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-fixed-dim/0 group-hover:bg-primary-fixed-dim/5 transition-colors pointer-events-none"></div>
        <span className="font-label-md text-label-md text-on-surface-variant">
          In Progress
        </span>
        <div className="flex items-center gap-2">
          <span className="font-title-lg text-title-lg font-semibold text-on-surface">
            {inProgress}
          </span>
          <span className="bg-primary-fixed-dim/10 text-primary-fixed-dim px-2 py-0.5 rounded font-label-sm text-label-sm border border-primary-fixed-dim/20">
            Blue
          </span>
        </div>
      </div>

      {/* Done */}
      <div className="bg-[#1E293B] rounded-xl p-4 border border-[#334155] flex flex-col gap-1 hover:border-secondary-fixed transition-colors group relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary-fixed/0 group-hover:bg-secondary-fixed/5 transition-colors pointer-events-none"></div>
        <span className="font-label-md text-label-md text-on-surface-variant">
          Done
        </span>
        <div className="flex items-center gap-2">
          <span className="font-title-lg text-title-lg font-semibold text-on-surface">
            {done}
          </span>
          <span className="bg-secondary-fixed/10 text-secondary-fixed px-2 py-0.5 rounded font-label-sm text-label-sm border border-secondary-fixed/20">
            Green
          </span>
        </div>
      </div>
    </div>
  );
}
