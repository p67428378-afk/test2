import React from "react";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
  ...props
}) {
  const baseStyle =
    "px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm";
  const variants = {
    primary:
      "bg-[#6366F1] hover:bg-indigo-600 text-white shadow-[0_0_10px_rgba(99,102,241,0.2)] disabled:bg-indigo-500/50 disabled:cursor-not-allowed",
    secondary:
      "border border-outline-variant/30 text-on-surface-variant hover:bg-surface-variant hover:text-on-surface disabled:opacity-50 disabled:cursor-not-allowed",
    danger:
      "bg-red-500 hover:bg-red-600 text-white disabled:bg-red-500/50 disabled:cursor-not-allowed",
    success:
      "bg-emerald-500 hover:bg-emerald-600 text-white disabled:bg-emerald-500/50 disabled:cursor-not-allowed",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
