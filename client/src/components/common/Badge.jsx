import React from "react";

export default function Badge({
  children,
  variant = "default",
  className = "",
}) {
  const variants = {
    default: "bg-gray-100 text-gray-800 border-gray-200",
    primary: "bg-[#e8f4f8] text-[#1485b8] border-[#bce0f0]",
    success: "bg-green-100 text-[#149e52] border-green-200",
    warning: "bg-amber-100 text-[#eb9414] border-amber-200",
    error: "bg-red-100 text-[#db2727] border-red-200",
    info: "bg-blue-100 text-blue-800 border-blue-200",
    paid: "bg-green-100 text-[#149e52] border-green-200",
    pending: "bg-amber-100 text-[#eb9414] border-amber-200",
    refunded: "bg-gray-100 text-gray-700 border-gray-300",
    scheduled: "bg-blue-100 text-blue-800 border-blue-200",
    completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };

  const selectedVariant = variants[variant.toLowerCase()] || variants.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${selectedVariant} ${className}`}
    >
      {children}
    </span>
  );
}
