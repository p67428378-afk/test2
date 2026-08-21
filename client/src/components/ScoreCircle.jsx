import React from "react";

export default function ScoreCircle({ score, total }) {
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const strokeDashoffset = 251.2 - (251.2 * percentage) / 100;

  let colorClass = "text-error";
  let strokeColor = "#db2626";
  if (percentage >= 80) {
    colorClass = "text-success";
    strokeColor = "#17a34a";
  } else if (percentage >= 50) {
    colorClass = "text-warning";
    strokeColor = "#eab308";
  }

  return (
    <div className="flex flex-col items-center justify-center relative size-40">
      <svg className="size-full transform -rotate-90" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="40"
          className="stroke-gray-100"
          strokeWidth="8"
          fill="transparent"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke={strokeColor}
          strokeWidth="8"
          fill="transparent"
          strokeDasharray="251.2"
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-out"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={`text-3xl font-extrabold ${colorClass}`}>
          {percentage}%
        </span>
        <span className="text-xs font-medium text-text_secondary mt-1">
          {score} / {total} correct
        </span>
      </div>
    </div>
  );
}
