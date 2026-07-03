import React from "react";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
}) {
  const baseStyles =
    "px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

  const variants = {
    primary:
      "bg-amber-500 hover:bg-amber-600 text-slate-950 focus:ring-amber-500",
    secondary:
      "bg-slate-100 hover:bg-slate-200 text-slate-700 focus:ring-slate-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    success:
      "bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500",
    outline:
      "border border-slate-300 hover:bg-slate-50 text-slate-700 focus:ring-slate-500",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
