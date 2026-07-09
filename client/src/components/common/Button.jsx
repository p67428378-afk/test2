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
    "px-4 py-2 rounded-md font-semibold text-sm shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-dg-yellow hover:bg-yellow-400 text-dg-black focus:ring-dg-yellow border border-transparent",
    secondary:
      "bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 focus:ring-gray-500",
    danger:
      "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 border border-transparent",
    success:
      "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 border border-transparent",
  };

  const disabledStyles = "opacity-50 cursor-not-allowed pointer-events-none";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${disabled ? disabledStyles : ""} ${className}`}
    >
      {children}
    </button>
  );
}
