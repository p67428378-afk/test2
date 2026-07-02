import React from "react";

export default function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  onClick,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
    secondary:
      "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-indigo-500",
    danger: "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500",
    success:
      "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  return (
    <button
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}
