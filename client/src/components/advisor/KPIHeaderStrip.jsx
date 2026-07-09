import React from "react";
import { Percent, DollarSign, TrendingUp, Layers } from "lucide-react";

export default function KPIHeaderStrip({ kpis, loading }) {
  const cards = [
    {
      title: "In-Stock Rate",
      value: kpis ? `${kpis.in_stock_rate}%` : "0.0%",
      icon: Percent,
      color: "text-green-600 bg-green-50 border-green-100",
      desc: "Target: >95.0%",
    },
    {
      title: "Private Brand Mix",
      value: kpis ? `${kpis.private_brand_pct}%` : "0.0%",
      icon: Layers,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      desc: "Target: >20.0%",
    },
    {
      title: "Sales / Linear Foot",
      value: kpis ? `$${kpis.sales_per_linear_ft.toLocaleString()}` : "$0.00",
      icon: DollarSign,
      color: "text-dg-black bg-yellow-50 border-yellow-100",
      desc: "Weekly average",
    },
    {
      title: "Shelf Capacity Utilized",
      value: kpis ? `${kpis.shelf_capacity}%` : "0.0%",
      icon: TrendingUp,
      color: "text-purple-600 bg-purple-50 border-purple-100",
      desc: "Max limit: 90.0%",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow duration-150"
          >
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {card.title}
              </p>
              {loading ? (
                <div className="h-7 w-24 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-2xl font-extrabold text-gray-900 tracking-tight">
                  {card.value}
                </p>
              )}
              <p className="text-xs text-gray-400 font-medium">{card.desc}</p>
            </div>
            <div
              className={`p-3 rounded-lg border ${card.color} flex-shrink-0`}
            >
              <Icon className="h-6 w-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
