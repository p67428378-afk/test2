import React from "react";

export default function ValueGauge({
  efficiency = 0,
  waste = 0,
  targetVisits = 0,
  currentVisits = 0,
}) {
  // Calculate stroke-dashoffset for circular progress
  // Radius is 45, circumference is 2 * pi * 45 = 282.74
  const circumference = 282.74;
  const strokeDashoffset = circumference - (efficiency / 100) * circumference;

  return (
    <div className="lg:col-span-5 glass-card rounded-xl p-lg flex flex-col items-center justify-center min-h-[320px] text-center w-full">
      <h2 className="font-headline-md text-headline-md font-semibold text-on-surface mb-xl w-full text-left">
        Value-for-Money Gauge
      </h2>
      {/* Circular Progress */}
      <div className="relative w-48 h-48 flex items-center justify-center rounded-full bg-surface-container-highest mb-lg shadow-inner">
        <svg
          className="absolute inset-0 w-full h-full transform -rotate-90"
          viewBox="0 0 100 100"
        >
          <circle
            className="text-surface-container-low"
            cx="50"
            cy="50"
            fill="none"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
          ></circle>
          <circle
            className={`${efficiency >= 50 ? "text-secondary" : "text-tertiary-container"} transition-all duration-1000 ease-out`}
            cx="50"
            cy="50"
            fill="none"
            r="45"
            stroke="currentColor"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            strokeWidth="8"
          ></circle>
        </svg>
        <div className="flex flex-col items-center">
          <span className="font-display-lg text-[40px] font-bold text-on-surface leading-none">
            {Math.round(efficiency)}%
          </span>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide mt-1">
            Efficiency
          </span>
        </div>
      </div>
      <div className="bg-error-container/20 border border-error-container/30 rounded-lg p-sm w-full">
        <p className="font-body-sm text-body-sm text-error font-medium">
          {waste > 0
            ? `You are wasting $${waste.toFixed(2)}/mo.`
            : "Excellent! No waste this month."}
        </p>
        <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
          {targetVisits > currentVisits
            ? `Need ${targetVisits - currentVisits} more visits to reach target.`
            : "You have met your value-for-money goals!"}
        </p>
      </div>
    </div>
  );
}
