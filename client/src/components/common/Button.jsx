import React from "react";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  icon: Icon,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-[#2663eb] text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-white border border-[#e3e8f0] text-[#171c29] hover:bg-gray-50 focus:ring-gray-300",
    danger: "bg-[#dc2626] text-white hover:bg-red-700 focus:ring-red-500",
    ghost:
      "bg-transparent text-[#707a8c] hover:text-[#171c29] hover:bg-gray-100 focus:ring-gray-300",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-5 py-3 text-base gap-2.5",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </button>
  );
}
