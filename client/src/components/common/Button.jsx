import React from "react";

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}) {
  const baseStyles =
    "px-6 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 active:scale-95";

  const variants = {
    primary:
      "bg-secondary text-[#0F172A] hover:bg-[#34d399] shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]",
    danger:
      "bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/50 hover:bg-[#EF4444]/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]",
    secondary:
      "bg-surface-container-highest text-on-surface border border-outline-variant hover:bg-surface-bright",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
