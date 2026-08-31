import React from "react";

export default function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
  className = "",
  icon: Icon,
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-[#1466bf] text-white hover:bg-[#0e4b8f] focus:ring-[#1466bf]",
    secondary:
      "bg-white text-[#171f2e] border border-[#dee3ed] hover:bg-gray-50 focus:ring-[#1466bf]",
    accent: "bg-[#149e52] text-white hover:bg-[#0e733b] focus:ring-[#149e52]",
    danger: "bg-[#d92d2d] text-white hover:bg-red-700 focus:ring-[#d92d2d]",
    ghost:
      "bg-transparent text-[#6b758a] hover:text-[#171f2e] hover:bg-gray-100 focus:ring-gray-300",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2.5",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}
