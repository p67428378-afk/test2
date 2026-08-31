import React from "react";

export default function Badge({
  children,
  variant = "default",
  className = "",
  size = "sm",
}) {
  const variants = {
    default: "bg-blue-50 text-[#1466bf] border-blue-200",
    success: "bg-green-50 text-[#149e52] border-green-200",
    warning: "bg-amber-50 text-[#eb941a] border-amber-200",
    error: "bg-red-50 text-[#d92d2d] border-red-200",
    neutral: "bg-gray-100 text-[#6b758a] border-gray-200",
    anatomy: "bg-purple-50 text-purple-700 border-purple-200",
    physiology: "bg-rose-50 text-rose-700 border-rose-200",
    biochemistry: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  const sizes = {
    xs: "px-2 py-0.5 text-[10px]",
    sm: "px-2.5 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${variants[variant] || variants.default} ${sizes[size] || sizes.sm} ${className}`}
    >
      {children}
    </span>
  );
}
