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
    "px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6366F1] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-[#6366F1] text-white hover:bg-opacity-90",
    secondary:
      "border border-slate-700 text-white hover:border-slate-500 bg-transparent",
    danger: "bg-red-600 text-white hover:bg-red-700",
    success: "bg-[#10B981] text-white hover:bg-opacity-90",
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
