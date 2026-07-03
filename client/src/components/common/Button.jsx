import React from "react";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
}) {
  const baseStyles =
    "px-4 py-2 rounded-md font-label-md font-bold transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-primary-container text-on-primary hover:bg-surface-tint hover:shadow-[0_4px_12px_rgba(16,185,129,0.2)]",
    secondary:
      "border-2 border-[#0D9488] text-[#0D9488] hover:bg-[#0D9488] hover:text-white",
    danger: "bg-error text-on-error hover:bg-red-700",
    outline:
      "border border-outline-variant text-on-surface-variant hover:bg-surface-container-low",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
