import React from "react";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
}) {
  const baseStyles =
    "px-md py-sm rounded-lg font-label-md text-label-md transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-primary text-on-primary hover:bg-primary-fixed-dim",
    secondary:
      "bg-surface-container-high text-on-surface hover:bg-surface-container-highest border border-outline-variant",
    danger: "bg-error text-on-error hover:bg-error-container",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
