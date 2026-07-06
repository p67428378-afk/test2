import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export default function EnergyFlowChart({ data }) {
  // Generate mock flow data if none is provided
  const chartData = data || [
    { time: "00:00", generation: 1.2, consumption: 2.1 },
    { time: "04:00", generation: 0.8, consumption: 1.8 },
    { time: "08:00", generation: 3.5, consumption: 2.5 },
    { time: "12:00", generation: 5.8, consumption: 3.0 },
    { time: "16:00", generation: 4.2, consumption: 3.8 },
    { time: "20:00", generation: 1.5, consumption: 4.5 },
  ];

  return (
    <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-6 shadow-lg h-[400px] flex flex-col">
      <h3 className="text-base font-semibold text-[#F8FAFC] mb-4">
        Energy Flow (Generation vs. Consumption)
      </h3>
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorGen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorCons" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#94A3B8" fontSize={12} />
            <YAxis stroke="#94A3B8" fontSize={12} unit=" kW" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1E293B",
                borderColor: "#475569",
                color: "#F8FAFC",
              }}
              itemStyle={{ color: "#F8FAFC" }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" />
            <Area
              type="monotone"
              dataKey="generation"
              name="Total Generation"
              stroke="#10B981"
              fillOpacity={1}
              fill="url(#colorGen)"
            />
            <Area
              type="monotone"
              dataKey="consumption"
              name="Total Consumption"
              stroke="#3B82F6"
              fillOpacity={1}
              fill="url(#colorCons)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
