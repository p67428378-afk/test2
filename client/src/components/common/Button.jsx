import React from "react";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  onClick,
  type = "button",
  disabled = false,
  className = "",
  icon: Icon,
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-[#2663eb] text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary:
      "bg-[#f2f5fa] text-[#171c29] hover:bg-gray-200 focus:ring-gray-400 border border-[#e3e8f0]",
    accent: "bg-[#17a34a] text-white hover:bg-green-700 focus:ring-green-500",
    danger: "bg-[#db2626] text-white hover:bg-red-700 focus:ring-red-500",
    outline:
      "border border-[#2663eb] text-[#2663eb] hover:bg-blue-50 focus:ring-blue-500",
  };

  const sizes = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {children}
    </button>
  );
}
