import React from "react";

export default function Badge({
  children,
  variant = "default",
  className = "",
}) {
  const variantStyles = {
    default: "bg-[#f2f5fa] text-[#707a8c] border border-[#e3e8f0]",
    primary: "bg-blue-50 text-[#2663eb] border border-blue-200",
    success: "bg-emerald-50 text-[#17a34a] border border-emerald-200",
    warning: "bg-amber-50 text-[#eb9917] border border-amber-200",
    danger: "bg-rose-50 text-[#db2626] border border-rose-200",
  };

  const selectedVariant = variantStyles[variant] || variantStyles.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedVariant} ${className}`}
    >
      {children}
    </span>
  );
}
