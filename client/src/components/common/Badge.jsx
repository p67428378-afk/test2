import React from "react";

export default function Badge({ children, variant = "info" }) {
  const variants = {
    success:
      "bg-tertiary-container/10 text-tertiary-container border border-tertiary-container/20",
    warning:
      "bg-primary-container/10 text-primary-container border border-primary-container/20",
    danger: "bg-error/10 text-error border border-error/20",
    info: "bg-secondary-container/10 text-secondary-container border border-secondary-container/20",
  };

  return (
    <span
      className={`inline-block px-2 py-1 rounded font-label-md text-[10px] uppercase tracking-wider ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
