import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Shield, TrendingUp, Truck, CheckCircle2, Package } from "lucide-react";

export default function WasteAnalyticsChart({ analytics }) {
  const data = [
    { name: "Rescued (kg)", value: analytics?.total_rescued_kg || 150 },
    { name: "Claims", value: analytics?.total_claims_count || 12 },
    { name: "Active Routes", value: analytics?.active_routes || 5 },
    { name: "Completed", value: analytics?.successful_deliveries_count || 10 },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center space-x-2">
        <TrendingUp className="h-5 w-5 text-emerald-600" />
        <span>Food Waste & Rescue Operations Analytics</span>
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
          <p className="text-xs font-medium text-emerald-600 uppercase tracking-wider">
            Total Rescued
          </p>
          <p className="text-2xl font-bold text-emerald-900 mt-1">
            {analytics?.total_rescued_kg || 0} kg
          </p>
        </div>
        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">
            Total Claims
          </p>
          <p className="text-2xl font-bold text-blue-900 mt-1">
            {analytics?.total_claims_count || 0}
          </p>
        </div>
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
          <p className="text-xs font-medium text-amber-600 uppercase tracking-wider">
            Active Routes
          </p>
          <p className="text-2xl font-bold text-amber-900 mt-1">
            {analytics?.active_routes || 0}
          </p>
        </div>
        <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
          <p className="text-xs font-medium text-indigo-600 uppercase tracking-wider">
            Completed Deliveries
          </p>
          <p className="text-2xl font-bold text-indigo-900 mt-1">
            {analytics?.successful_deliveries_count || 0}
          </p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E2E8F0"
            />
            <XAxis
              dataKey="name"
              stroke="#64748B"
              fontSize={12}
              tickLine={false}
            />
            <YAxis stroke="#64748B" fontSize={12} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0F172A",
                borderRadius: "8px",
                color: "#FFF",
                border: "none",
              }}
            />
            <Bar dataKey="value" fill="#10B981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
