import React from "react";

export default function Card({ children, title, className = "" }) {
  return (
    <div
      className={`bg-white border border-[#e3e8f0] rounded-2xl p-6 shadow-sm flex flex-col gap-3 w-full ${className}`}
    >
      {title && (
        <h3 className="font-bold text-[#171c29] text-lg border-b border-[#e3e8f0] pb-2">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
