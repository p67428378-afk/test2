import React from "react";

export default function KPICard({
  title,
  value,
  subElement,
  borderClass = "",
}) {
  return (
    <div
      className={`bg-[#0F172A] border border-subtle p-sm rounded flex flex-col justify-between ${borderClass}`}
    >
      <span className="font-label-caps text-label-caps text-[#94A3B8]">
        {title}
      </span>
      <div className="flex items-end justify-between mt-xs">
        <span className="font-display-lg text-display-lg font-data-mono">
          {value}
        </span>
        {subElement}
      </div>
    </div>
  );
}
