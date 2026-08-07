import React from "react";

export default function Button({
  children,
  variant = "primary",
  className = "",
  type = "button",
  ...props
}) {
  const baseStyles =
    "px-4 py-2 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-[#6366F1] hover:bg-primary text-white shadow-sm",
    secondary:
      "bg-surface-container-low hover:bg-surface-container border border-outline-variant text-on-surface-variant",
    danger: "bg-error hover:bg-error/90 text-white shadow-sm",
    ghost:
      "hover:bg-surface-container-low text-on-surface-variant hover:text-on-surface",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
