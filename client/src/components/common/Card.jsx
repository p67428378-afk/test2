import React from "react";

export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white border border-[#e0e5f0] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}
    >
      {children}
    </div>
  );
}
