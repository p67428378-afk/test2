import React from "react";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
  className = "",
}) {
  const baseStyles =
    "font-label-md text-label-md py-sm px-lg rounded-lg transition-all font-bold active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-primary text-on-primary hover:bg-primary-fixed shadow-[0_0_15px_rgba(192,193,255,0.2)]",
    secondary: "border border-primary text-primary hover:bg-primary/10",
    danger: "bg-error text-on-error hover:bg-error-container/80",
    text: "text-on-surface-variant hover:text-primary hover:bg-surface-container-highest",
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
