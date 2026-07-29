import React from "react";

export default function Badge({ children, variant = "info" }) {
  const baseStyles =
    "px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 w-fit";

  const variants = {
    success: "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400",
    warning: "bg-amber-500/10 border border-amber-500/30 text-amber-400",
    danger: "bg-rose-500/10 border border-rose-500/30 text-rose-400",
    info: "bg-indigo-500/10 border border-indigo-500/30 text-indigo-400",
    slate: "bg-slate-500/10 border border-slate-500/30 text-slate-400",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]}`}>{children}</span>
  );
}
