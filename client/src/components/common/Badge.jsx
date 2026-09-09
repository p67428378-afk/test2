import React from "react";

export default function Badge({
  children,
  variant = "default",
  className = "",
}) {
  const variants = {
    default: "bg-slate-800 text-slate-200 border-slate-700",
    success: "bg-emerald-950/90 text-emerald-300 border-emerald-800/80",
    warning: "bg-amber-950/90 text-amber-300 border-amber-800/80",
    danger: "bg-red-950/90 text-red-300 border-red-800/80",
    info: "bg-blue-950/90 text-blue-300 border-blue-800/80",
    purple: "bg-purple-950/90 text-purple-300 border-purple-800/80",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {children}
    </span>
  );
}
