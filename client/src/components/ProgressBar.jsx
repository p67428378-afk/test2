import React from "react";

export default function ProgressBar({ current, total }) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full max-w-xl">
      <div className="flex justify-between items-center text-sm font-medium text-text_secondary mb-2">
        <span>Progress</span>
        <span>
          {current} of {total} cards
        </span>
      </div>
      <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
        <div
          className="bg-primary h-full transition-all duration-300 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
