import React from "react";

export default function Badge({ status }) {
  const styles = {
    available: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    requested: "bg-amber-100 text-yellow-800 border border-amber-200",
    assigned: "bg-blue-100 text-blue-800 border border-blue-200",
    picked_up: "bg-indigo-100 text-indigo-800 border border-indigo-200",
    delivered: "bg-slate-100 text-slate-800 border border-slate-200",
    pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
  };

  const label = status ? status.replace("_", " ").toUpperCase() : "UNKNOWN";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[status] || "bg-slate-100 text-slate-800"}`}
    >
      {label}
    </span>
  );
}
