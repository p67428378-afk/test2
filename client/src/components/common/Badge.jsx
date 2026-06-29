import React from "react";

export default function Badge({
  children,
  variant = "primary",
  className = "",
}) {
  const baseStyles =
    "font-label-sm text-label-sm px-3 py-1 rounded-full border font-medium inline-flex items-center gap-1";

  const variants = {
    primary: "text-primary bg-primary/10 border-primary/20",
    secondary: "text-secondary bg-secondary/10 border-secondary/20",
    warning:
      "text-tertiary-container bg-tertiary-container/10 border-tertiary-container/20",
    error: "text-error bg-error/10 border-error/20",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
