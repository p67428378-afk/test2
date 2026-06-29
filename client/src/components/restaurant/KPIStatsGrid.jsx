import React from "react";
import PropTypes from "prop-types";

export default function KPIStatsGrid({ stats }) {
  const cards = [
    {
      label: "Total Orders",
      value: stats.total_orders || 0,
      icon: "shopping_bag",
      color: "text-brand-coral bg-brand-coral/10",
    },
    {
      label: "Total Revenue",
      value: `$${(stats.total_revenue || 0).toFixed(2)}`,
      icon: "payments",
      color: "text-brand-green bg-brand-green/10",
    },
    {
      label: "Active Orders",
      value: stats.active_orders || 0,
      icon: "pending_actions",
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Average Rating",
      value: stats.rating ? stats.rating.toFixed(1) : "N/A",
      icon: "star",
      color: "text-yellow-500 bg-yellow-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-2xl border border-outline-variant p-6 flex items-center justify-between shadow-sm"
        >
          <div className="space-y-1">
            <p className="font-label-sm text-xs text-on-surface-variant font-medium">
              {card.label}
            </p>
            <p className="font-headline-lg text-on-surface text-2xl font-black">
              {card.value}
            </p>
          </div>
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${card.color}`}
          >
            <span className="material-symbols-outlined text-2xl">
              {card.icon}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

KPIStatsGrid.propTypes = {
  stats: PropTypes.shape({
    total_orders: PropTypes.number,
    total_revenue: PropTypes.number,
    active_orders: PropTypes.number,
    rating: PropTypes.number,
  }).isRequired,
};
