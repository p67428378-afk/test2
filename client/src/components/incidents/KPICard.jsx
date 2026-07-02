import React from "react";

export default function KPICard({
  title,
  value,
  icon: Icon,
  color = "blue",
  description,
}) {
  const getColorClasses = () => {
    switch (color) {
      case "red":
        return {
          bg: "bg-red-50 border-red-200",
          iconBg: "bg-red-100 text-red-600",
          text: "text-red-800",
        };
      case "emerald":
        return {
          bg: "bg-emerald-50 border-emerald-200",
          iconBg: "bg-emerald-100 text-emerald-600",
          text: "text-emerald-800",
        };
      case "amber":
        return {
          bg: "bg-amber-50 border-amber-200",
          iconBg: "bg-amber-100 text-amber-600",
          text: "text-amber-800",
        };
      default:
        return {
          bg: "bg-blue-50 border-blue-200",
          iconBg: "bg-blue-100 text-blue-600",
          text: "text-blue-800",
        };
    }
  };

  const classes = getColorClasses();

  return (
    <div
      className={`p-6 rounded-xl border shadow-sm flex items-start justify-between transition-all duration-200 hover:shadow-md ${classes.bg}`}
    >
      <div className="space-y-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-slate-900">
            {value}
          </span>
        </div>
        {description && (
          <p className="text-xs text-slate-500 font-medium">{description}</p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${classes.iconBg}`}>
        <Icon className="h-6 w-6" />
      </div>
    </div>
  );
}
