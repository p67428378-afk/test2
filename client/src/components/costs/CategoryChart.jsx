import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function CategoryChart({ categoryBreakdown = [] }) {
  if (!categoryBreakdown || categoryBreakdown.length === 0) {
    return (
      <div className="bg-white border border-[#e3e8f0] rounded-xl p-8 text-center text-[#707a8c] shadow-sm">
        No cost breakdown data available.
      </div>
    );
  }

  const chartData = categoryBreakdown.map((item) => ({
    name: item.category_name,
    Estimated: item.estimated || 0,
    Actual: item.actual || 0,
    Variance: item.variance || 0,
  }));

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl p-5 shadow-sm">
      <h3 className="text-sm font-bold text-[#171c29] mb-4">
        Expenses by Category (Estimated vs Actual)
      </h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e3e8f0" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#707a8c" }} />
            <YAxis tick={{ fontSize: 12, fill: "#707a8c" }} unit="$" />
            <Tooltip
              formatter={(value) => [`$${Number(value).toFixed(2)}`, ""]}
              contentStyle={{
                backgroundColor: "#fff",
                borderRadius: "8px",
                border: "1px solid #e3e8f0",
              }}
            />
            <Legend wrapperStyle={{ paddingTop: "10px" }} />
            <Bar dataKey="Estimated" fill="#2663eb" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Actual" fill="#17a34a" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
