import React from "react";

export default function Badge({ status, children }) {
  const normalizedStatus = (status || "").toLowerCase();

  const styles = {
    settled: "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400",
    passed: "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400",
    cleared: "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400",
    pending: "bg-amber-500/10 border border-amber-500/20 text-amber-400",
    failed: "bg-red-500/10 border border-red-500/20 text-red-400",
    reversed: "bg-red-500/10 border border-red-500/20 text-red-400",
    "manual review":
      "bg-purple-500/10 border border-purple-500/20 text-purple-400",
  };

  const currentStyle =
    styles[normalizedStatus] ||
    "bg-surface-variant border border-outline-variant/20 text-on-surface-variant";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${currentStyle}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          normalizedStatus === "settled" ||
          normalizedStatus === "passed" ||
          normalizedStatus === "cleared"
            ? "bg-emerald-500"
            : normalizedStatus === "pending"
              ? "bg-amber-400 status-dot-pulse"
              : normalizedStatus === "failed" || normalizedStatus === "reversed"
                ? "bg-red-500"
                : "bg-purple-500"
        }`}
      />
      {children || status}
    </span>
  );
}
