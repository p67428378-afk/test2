import React from "react";
import { Package, AlertTriangle, DollarSign, Home } from "lucide-react";

export default function MetricGroup({
  items = [],
  lowStockCount = 0,
  inventory = [],
  warehouses = [],
}) {
  const totalCatalogItems = items.length;

  // Calculate total stock value
  const totalStockValue = inventory.reduce((sum, record) => {
    const item = items.find((i) => i.id === record.item_id);
    if (item) {
      return sum + record.current_stock * item.unit_price;
    }
    return sum;
  }, 0);

  const activeWarehouses = warehouses.length;

  const metrics = [
    {
      label: "Total Catalog Items",
      value: totalCatalogItems,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Low Stock Alerts",
      value: lowStockCount,
      icon: AlertTriangle,
      color: lowStockCount > 0 ? "text-red-600" : "text-green-600",
      bg: lowStockCount > 0 ? "bg-red-50" : "bg-green-50",
    },
    {
      label: "Total Stock Value",
      value: `$${totalStockValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Active Warehouses",
      value: activeWarehouses,
      icon: Home,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
      {metrics.map((metric, idx) => {
        const Icon = metric.icon;
        return (
          <div
            key={idx}
            className="bg-white border border-[#e3e8f0] rounded-xl p-6 flex items-center justify-between shadow-sm"
          >
            <div>
              <p className="text-sm font-medium text-[#707a8c] mb-1">
                {metric.label}
              </p>
              <p className="text-2xl font-bold text-[#0f172a]">
                {metric.value}
              </p>
            </div>
            <div className={`${metric.bg} ${metric.color} p-3 rounded-lg`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
