import React from "react";

export default function Badge({ text, variant = "info" }) {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase";

  const variants = {
    success: "bg-green-100 text-green-800 border border-green-200",
    warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    danger: "bg-red-100 text-red-800 border border-red-200",
    info: "bg-blue-100 text-blue-800 border border-blue-200",
    neutral: "bg-gray-100 text-gray-800 border border-gray-200",
  };

  return (
    <span className={`${baseStyles} ${variants[variant] || variants.info}`}>
      {text}
    </span>
  );
}
