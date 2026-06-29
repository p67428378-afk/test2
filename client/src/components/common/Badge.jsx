import React from "react";

export default function Badge({ children, variant = "info", className = "" }) {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

  const variants = {
    info: "bg-secondary-container text-on-secondary-container",
    success: "bg-brand-green/10 text-brand-green",
    warning: "bg-primary-fixed text-on-primary-fixed-variant",
    danger: "bg-error-container text-on-error-container",
    primary: "bg-primary-container text-on-primary-container",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
