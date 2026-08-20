import React from "react";

export default function Badge({
  children,
  variant = "success",
  className = "",
}) {
  const baseStyles =
    "px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center justify-center";

  const variants = {
    success: "bg-[#0fba82] text-white",
    danger: "bg-[#f04545] text-white",
    warning: "bg-warning text-white",
    info: "bg-primary text-white",
    secondary: "bg-[#edf2fa] text-[#63738c]",
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}
