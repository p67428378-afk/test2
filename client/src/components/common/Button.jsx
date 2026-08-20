import React from "react";

export default function Button({
  children,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
}) {
  const baseStyles =
    "flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shrink-0";
  const variants = {
    primary: "bg-[#2663eb] text-white hover:bg-blue-700 disabled:bg-blue-300",
    secondary:
      "bg-white border border-[#e3e8f0] text-[#171c29] hover:bg-gray-50 disabled:bg-gray-100",
    danger: "bg-[#db2626] text-white hover:bg-red-700 disabled:bg-red-300",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]}`}
    >
      {children}
    </button>
  );
}
