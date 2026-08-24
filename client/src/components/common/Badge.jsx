import React from "react";

export default function Badge({
  children,
  variant = "primary",
  className = "",
}) {
  const baseStyle =
    "px-2 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase inline-block";

  const variants = {
    primary: "bg-[#2663eb] text-white",
    secondary: "bg-[#f2f5fa] text-[#707a8c] border border-[#e3e8f0]",
    accent: "bg-[#eb9917] text-white",
    success: "bg-[#17a34a] text-white",
  };

  return (
    <span className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
