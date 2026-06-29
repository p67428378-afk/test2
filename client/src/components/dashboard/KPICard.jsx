import React from "react";

export default function KPICard({
  title,
  value,
  subtitle,
  icon,
  variant = "primary",
  progress = null,
  alert = false,
}) {
  const borderColors = {
    primary: "border-t-2 border-t-primary",
    secondary: "border-t-2 border-t-secondary",
    warning: "border-t-2 border-t-tertiary-container",
  };

  return (
    <div
      className={`glass-card rounded-xl p-lg flex flex-col justify-between h-[160px] relative overflow-hidden ${borderColors[variant]}`}
    >
      {alert && (
        <div className="absolute inset-0 bg-tertiary-container/5 rounded-xl pointer-events-none"></div>
      )}
      <div className="flex justify-between items-start relative z-10">
        <div>
          <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-1">
            {title}
          </h3>
          {subtitle && (
            <p className="font-body-lg text-body-lg font-medium text-on-surface mt-1">
              {subtitle}
            </p>
          )}
        </div>
        <span
          className={`material-symbols-outlined opacity-80 ${variant === "primary" ? "text-primary" : variant === "secondary" ? "text-secondary" : "text-tertiary-container"}`}
        >
          {icon}
        </span>
      </div>
      <div className="mt-auto flex flex-col gap-2 relative z-10">
        <div
          className={`font-mono-data font-bold ${variant === "warning" ? "text-tertiary-container text-[32px]" : "text-primary text-[24px]"}`}
        >
          {value}
        </div>
        {progress !== null && (
          <div className="w-full bg-surface-container-high rounded-full h-2">
            <div
              className={`h-2 rounded-full ${variant === "secondary" ? "bg-secondary" : "bg-primary"}`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}
