import React from "react";

export default function KPIGrid({ metrics }) {
  const kpis = [
    {
      title: "Total Sales",
      value: metrics ? `$${Number(metrics.total_sales).toFixed(2)}` : "$0.00",
      icon: "payments",
      color: "text-primary bg-primary-container/10",
    },
    {
      title: "Total Orders",
      value: metrics ? metrics.total_orders : 0,
      icon: "shopping_bag",
      color: "text-tertiary bg-tertiary-container/10",
    },
    {
      title: "Active Customers",
      value: metrics ? metrics.active_customers : 0,
      icon: "group",
      color: "text-secondary bg-secondary-container/10",
    },
    {
      title: "Low Stock Items",
      value: metrics ? metrics.low_stock_count : 0,
      icon: "warning",
      color: "text-error bg-error-container/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
      {kpis.map((kpi, index) => (
        <div
          key={index}
          className="bg-surface-container-lowest p-6 rounded-lg border border-outline-variant flex items-center gap-4"
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${kpi.color}`}
          >
            <span className="material-symbols-outlined text-[24px]">
              {kpi.icon}
            </span>
          </div>
          <div>
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide">
              {kpi.title}
            </p>
            <h3 className="font-headline-md text-headline-md font-bold text-on-surface mt-1">
              {kpi.value}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
}
