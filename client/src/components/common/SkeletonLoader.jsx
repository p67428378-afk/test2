import React from "react";

export default function SkeletonLoader({ count = 3 }) {
  return (
    <div className="space-y-3 p-2" data-testid="skeleton-loader">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="flex items-center gap-3 p-2 rounded-lg bg-slate-800/40 animate-pulse"
        >
          <div className="w-12 h-12 bg-slate-700/60 rounded-md shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-700/60 rounded w-3/4"></div>
            <div className="h-3 bg-slate-700/40 rounded w-1/2"></div>
          </div>
          <div className="h-4 bg-slate-700/40 rounded w-12 shrink-0"></div>
        </div>
      ))}
    </div>
  );
}
