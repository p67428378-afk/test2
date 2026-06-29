import React from "react";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-label-md text-label-md rounded-brand transition-all active:scale-95 focus:outline-none disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary: "bg-brand-coral hover:bg-brand-coral/90 text-white shadow-md",
    secondary:
      "bg-secondary-container hover:bg-secondary-container/80 text-on-secondary-container border border-outline-variant",
    outline:
      "border border-outline text-on-surface hover:bg-surface-container-high",
    danger: "bg-error hover:bg-error/90 text-white shadow-md",
    success: "bg-brand-green hover:bg-brand-green/90 text-white shadow-md",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
