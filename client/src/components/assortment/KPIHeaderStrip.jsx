import React from "react";
import { DollarSign, Percent, CheckCircle, Layers } from "lucide-react";

export default function KPIHeaderStrip({ metrics, loading }) {
  const formatCurrency = (val) => {
    if (val === undefined || val === null) return "$0.00";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(val);
  };

  const formatPercent = (val) => {
    if (val === undefined || val === null) return "0.0%";
    return `${val.toFixed(1)}%`;
  };

  const cards = [
    {
      title: "Sales per Linear Ft",
      value: formatCurrency(metrics?.sales_per_linear_ft),
      icon: DollarSign,
      color: "text-primary bg-primary/10",
      desc: "Target: > $150.00",
    },
    {
      title: "Private Brand Share",
      value: formatPercent(metrics?.private_brand_percentage),
      icon: Percent,
      color: "text-secondary bg-secondary/10",
      desc: "Target: >= 20.0%",
    },
    {
      title: "In-Stock Rate",
      value: formatPercent(metrics?.in_stock_rate),
      icon: CheckCircle,
      color: "text-primary-container bg-primary-container/10",
      desc: "Target: >= 95.0%",
    },
    {
      title: "Shelf Capacity",
      value: formatPercent(metrics?.shelf_capacity_percentage),
      icon: Layers,
      color: "text-tertiary bg-tertiary/10",
      desc: "Target: <= 90.0%",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white p-5 rounded-xl border border-outline-variant/30 shadow-sm flex items-start justify-between hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                {card.title}
              </span>
              {loading ? (
                <div className="h-8 w-24 bg-surface-container-highest animate-pulse rounded mt-1"></div>
              ) : (
                <span className="text-2xl font-bold text-on-surface mt-1">
                  {card.value}
                </span>
              )}
              <span className="text-xs text-on-surface-variant/80 mt-1">
                {card.desc}
              </span>
            </div>
            <div className={`p-3 rounded-lg ${card.color}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
