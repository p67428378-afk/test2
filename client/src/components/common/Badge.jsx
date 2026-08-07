import React from "react";

export default function Badge({ children, variant = "info", className = "" }) {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

  const variants = {
    success: "bg-[#DCFCE7] text-[#166534]",
    info: "bg-[#DBEAFE] text-[#1E40AF]",
    warning: "bg-[#FEF3C7] text-[#92400E]",
    danger: "bg-error-container text-on-error-container",
    neutral:
      "bg-surface-container-low text-on-surface-variant border border-outline-variant",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
