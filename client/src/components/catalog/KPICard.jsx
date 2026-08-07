import React from "react";

export default function KPICard({
  title,
  value,
  icon: Icon,
  badge,
  badgeColor = "error",
}) {
  const badgeColors = {
    error: "bg-error-container text-on-error-container",
    danger: "bg-error text-on-error",
    warning: "bg-amber-500/10 text-amber-500 border border-amber-500/20",
    success: "bg-[#DCFCE7] text-[#166534]",
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 shadow-[0_1px_3px_rgba(15,23,42,0.08)] flex flex-col justify-between h-full">
      <div className="flex justify-between items-start mb-4">
        <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
          {title}
        </p>
        {badge !== undefined ? (
          <span
            className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${badgeColors[badgeColor]}`}
          >
            {badge}
          </span>
        ) : (
          Icon && <Icon className="h-5 w-5 text-primary" />
        )}
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className="font-display-lg text-display-lg text-on-surface">
          {value}
        </h3>
      </div>
    </div>
  );
}
