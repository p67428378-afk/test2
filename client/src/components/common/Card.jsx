import React from "react";

export default function Card({
  children,
  className = "",
  glow = false,
  alert = false,
  ...props
}) {
  const glowClass = alert
    ? "alert-glow border-[#EF4444]/30"
    : glow
      ? "premium-glow border-[#6366F1]/30"
      : "border-[#334155]";

  return (
    <div
      className={`glass-panel rounded-xl p-6 relative overflow-hidden border ${glowClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
