import React from "react";

export default function Badge({ children, variant = "info", className = "" }) {
  const baseStyles =
    "px-2.5 py-0.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5";

  const variants = {
    success: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    warning: "bg-amber-100 text-amber-800 border border-amber-200",
    danger: "bg-red-100 text-red-800 border border-red-200",
    info: "bg-blue-100 text-blue-800 border border-blue-200",
    neutral: "bg-slate-100 text-slate-800 border border-slate-200",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
