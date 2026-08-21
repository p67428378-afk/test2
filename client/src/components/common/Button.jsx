import React from "react";

export default function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  className = "",
  icon: Icon,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-[#1485b8] text-white hover:bg-[#0f6e99] focus:ring-[#1485b8]",
    secondary:
      "bg-white text-[#171f2e] border border-[#e0e8f0] hover:bg-[#f0f5fa] focus:ring-[#1485b8]",
    outline:
      "border border-[#1485b8] text-[#1485b8] hover:bg-[#e8f4f8] focus:ring-[#1485b8]",
    danger: "bg-[#db2727] text-white hover:bg-red-700 focus:ring-[#db2727]",
    ghost: "text-[#6b7a8f] hover:bg-slate-100 hover:text-[#171f2e]",
  };

  const sizes = {
    sm: "px-2.5 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2.5",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span>{children}</span>
    </button>
  );
}
