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
    "px-4 py-2 rounded-md text-sm font-semibold transition-colors active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-[#c0c1ff] text-[#07006c] hover:bg-[#e1e0ff]",
    secondary:
      "bg-[#2d3449] text-[#dae2fd] hover:bg-[#31394d] border border-[#464554]",
    success: "bg-[#4edea3] text-[#002113] hover:bg-[#6ffbbe]",
    danger: "bg-[#ffb4ab] text-[#690005] hover:bg-[#ffdad6]",
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
