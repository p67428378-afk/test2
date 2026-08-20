import React from "react";

export default function Table({ headers, rows, className = "" }) {
  return (
    <div
      className={`border border-[#e0e5f0] rounded-xl overflow-hidden w-full bg-white ${className}`}
    >
      <div className="bg-[#edf2fa] flex gap-3 p-3 text-[#63738c] font-medium text-xs uppercase tracking-wider">
        {headers.map((header, idx) => (
          <div key={idx} className="flex-1 min-w-0">
            {header}
          </div>
        ))}
      </div>
      <div className="divide-y divide-[#e0e5f0]">
        {rows.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className="flex gap-3 p-3 text-[#1f293b] text-sm items-center hover:bg-[#f8fafc] transition-colors"
          >
            {row.map((cell, cellIdx) => (
              <div key={cellIdx} className="flex-1 min-w-0">
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
