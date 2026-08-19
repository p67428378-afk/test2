import React from "react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "blue",
  description,
  onClick,
  isActive = false,
}) {
  const colorStyles = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-200",
      activeRing: "ring-2 ring-blue-500",
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-600",
      border: "border-green-200",
      activeRing: "ring-2 ring-green-500",
    },
    amber: {
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "border-amber-200",
      activeRing: "ring-2 ring-amber-500",
    },
    red: {
      bg: "bg-red-50",
      text: "text-red-600",
      border: "border-red-200",
      activeRing: "ring-2 ring-red-500",
    },
  };

  const style = colorStyles[color] || colorStyles.blue;

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl p-5 border border-gray-200 shadow-sm transition-all ${
        onClick ? "cursor-pointer hover:shadow-md" : ""
      } ${isActive ? style.activeRing : ""}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-3xl font-extrabold text-gray-900 mt-1">
            {value ?? 0}
          </p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${style.bg} ${style.text}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}
