import React from "react";

export default function KPIStatsGrid({ stats }) {
  const items = [
    {
      label: "Total Revenue",
      value: `$${stats.total_revenue?.toFixed(2) || "0.00"}`,
      icon: "payments",
      color: "text-brand-green bg-brand-green/10",
    },
    {
      label: "Total Orders",
      value: stats.total_orders || 0,
      icon: "receipt_long",
      color: "text-brand-coral bg-brand-coral/10",
    },
    {
      label: "Average Rating",
      value: stats.rating ? stats.rating.toFixed(1) : "N/A",
      icon: "star",
      color: "text-amber-500 bg-amber-500/10",
    },
    {
      label: "Active Orders",
      value: stats.active_orders || 0,
      icon: "pending_actions",
      color: "text-blue-500 bg-blue-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm flex items-center justify-between"
        >
          <div>
            <p className="text-xs text-on-surface-variant font-medium mb-1">
              {item.label}
            </p>
            <h3 className="text-2xl font-black text-on-surface">
              {item.value}
            </h3>
          </div>
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${item.color}`}
          >
            <span className="material-symbols-outlined text-2xl">
              {item.icon}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
