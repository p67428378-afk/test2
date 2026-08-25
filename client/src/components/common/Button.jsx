import React from "react";

export default function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  onClick,
  disabled = false,
  className = "",
  icon: Icon,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-[#2663eb] hover:bg-[#1d4ed8] text-white focus:ring-blue-500 shadow-sm hover:shadow",
    secondary:
      "bg-white hover:bg-[#f2f5fa] text-[#171c29] border border-[#e3e8f0] focus:ring-gray-300 shadow-sm",
    danger:
      "bg-[#db2626] hover:bg-red-700 text-white focus:ring-red-500 shadow-sm",
    ghost:
      "bg-transparent hover:bg-[#f2f5fa] text-[#707a8c] hover:text-[#171c29] focus:ring-gray-200",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${
        variantStyles[variant] || variantStyles.primary
      } ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </button>
  );
}
