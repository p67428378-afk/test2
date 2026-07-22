import React from "react";

export default function ProgressBar({ value, max = 100, color = "primary" }) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const colors = {
    primary: "bg-primary-container",
    error: "bg-error",
    success: "bg-tertiary-container",
  };

  return (
    <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
      <div
        className={`${colors[color]} h-full rounded-full transition-all duration-300`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}
