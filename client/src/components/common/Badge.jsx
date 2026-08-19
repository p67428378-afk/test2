import React from "react";

export default function Badge({
  children,
  variant = "default",
  className = "",
}) {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-blue-100 text-[#2663eb]",
    success: "bg-green-100 text-[#17a34a]",
    warning: "bg-amber-100 text-[#eb9917]",
    danger: "bg-red-100 text-[#db2626]",
    info: "bg-sky-100 text-sky-800",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {children}
    </span>
  );
}
