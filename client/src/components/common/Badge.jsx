import React from "react";

export default function Badge({
  children,
  variant = "success",
  className = "",
}) {
  const baseStyles =
    "inline-flex items-center gap-1.5 py-1 px-2.5 rounded-full text-xs font-medium border";

  const variants = {
    success: "bg-secondary/10 text-secondary border-secondary/20",
    danger: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20",
    warning:
      "bg-tertiary-container/10 text-tertiary-container border-tertiary-container/20",
    info: "bg-primary/10 text-primary border-primary/20",
  };

  const dotColors = {
    success: "bg-secondary",
    danger: "bg-[#EF4444]",
    warning: "bg-tertiary-container",
    info: "bg-primary",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`}></span>
      {children}
    </span>
  );
}
