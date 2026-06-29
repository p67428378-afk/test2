import React from "react";

export default function PlatformHealthCharts({ metrics }) {
  if (!metrics) return null;

  const stats = [
    {
      label: "Total Platform Revenue",
      value: `$${metrics.total_revenue?.toFixed(2) || "0.00"}`,
      icon: "monetization_on",
      color: "text-brand-green bg-brand-green/10",
    },
    {
      label: "Total Orders Processed",
      value: metrics.total_orders || 0,
      icon: "shopping_bag",
      color: "text-brand-coral bg-brand-coral/10",
    },
    {
      label: "Active Customers",
      value: metrics.active_users?.customers || 0,
      icon: "person",
      color: "text-blue-500 bg-blue-500/10",
    },
    {
      label: "Active Restaurants",
      value: metrics.active_users?.restaurants || 0,
      icon: "storefront",
      color: "text-purple-500 bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-on-surface-variant font-medium mb-1">
                {stat.label}
              </p>
              <h3 className="text-2xl font-black text-on-surface">
                {stat.value}
              </h3>
            </div>
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color}`}
            >
              <span className="material-symbols-outlined text-2xl">
                {stat.icon}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Simulated Sales Trend Chart */}
      <div className="bg-white rounded-xl border border-outline-variant p-6 shadow-sm">
        <h3 className="font-headline-md text-base font-bold text-on-surface mb-4">
          Platform Sales Trend
        </h3>
        <div className="h-64 flex items-end gap-4 pt-6 border-b border-outline-variant">
          {metrics.recent_sales &&
            metrics.recent_sales.map((sale) => {
              const maxAmount = Math.max(
                ...metrics.recent_sales.map((s) => s.amount),
              );
              const heightPercent =
                maxAmount > 0 ? (sale.amount / maxAmount) * 80 : 0;
              return (
                <div
                  key={sale.date}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end"
                >
                  <span className="text-xs font-bold text-brand-coral">
                    ${sale.amount.toFixed(0)}
                  </span>
                  <div
                    className="w-full bg-brand-coral/20 hover:bg-brand-coral/40 rounded-t-brand transition-all duration-500 relative group"
                    style={{ height: `${heightPercent}%` }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-on-background text-white text-[10px] px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                      Date: {sale.date}
                    </div>
                  </div>
                  <span className="text-[10px] text-on-surface-variant font-medium truncate max-w-full">
                    {new Date(sale.date).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
