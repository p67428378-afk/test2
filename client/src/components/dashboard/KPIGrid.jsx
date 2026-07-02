import React from "react";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";

export default function KPIGrid({ shipments }) {
  const total = shipments.length;
  const inTransit = shipments.filter((s) =>
    ["assigned", "in transit", "out for delivery"].includes(
      s.status.toLowerCase(),
    ),
  ).length;
  const delivered = shipments.filter(
    (s) => s.status.toLowerCase() === "delivered",
  ).length;
  const booked = shipments.filter(
    (s) => s.status.toLowerCase() === "booked",
  ).length;

  const kpis = [
    {
      title: "Total Shipments",
      value: total,
      icon: Package,
      color: "bg-blue-500 text-blue-600 bg-blue-50",
    },
    {
      title: "Booked / Pending",
      value: booked,
      icon: Clock,
      color: "bg-amber-500 text-amber-600 bg-amber-50",
    },
    {
      title: "In Transit",
      value: inTransit,
      icon: Truck,
      color: "bg-indigo-500 text-indigo-600 bg-indigo-50",
    },
    {
      title: "Delivered",
      value: delivered,
      icon: CheckCircle,
      color: "bg-emerald-500 text-emerald-600 bg-emerald-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div
            key={idx}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium text-gray-500">{kpi.title}</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {kpi.value}
              </p>
            </div>
            <div
              className={`p-3 rounded-lg ${kpi.color.split(" ")[2]} ${kpi.color.split(" ")[1]}`}
            >
              <Icon className="h-6 w-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
