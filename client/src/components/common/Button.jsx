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
    "px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-primary text-white hover:bg-opacity-90 shadow-md hover:shadow-lg active:scale-95",
    secondary:
      "bg-white border border-[#e0e5f0] text-[#1f293b] hover:bg-[#f2f5fa] active:scale-95",
    danger:
      "bg-error text-white hover:bg-opacity-90 shadow-md hover:shadow-lg active:scale-95",
    success:
      "bg-success text-white hover:bg-opacity-90 shadow-md hover:shadow-lg active:scale-95",
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
