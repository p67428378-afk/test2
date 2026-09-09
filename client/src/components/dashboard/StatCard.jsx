import React from "react";

export default function StatCard({
  title,
  value,
  badgeText,
  badgeType = "success",
  icon,
}) {
  const getBadgeStyle = () => {
    switch (badgeType) {
      case "danger":
        return "bg-red-100 text-red-700 border-red-200";
      case "warning":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "success":
      default:
        return "bg-green-100 text-green-700 border-green-200";
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
          {title}
        </p>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
      {badgeText && (
        <span
          className={`inline-block mt-3 px-2.5 py-0.5 border text-xs rounded-full font-medium ${getBadgeStyle()}`}
        >
          {badgeText}
        </span>
      )}
    </div>
  );
}
