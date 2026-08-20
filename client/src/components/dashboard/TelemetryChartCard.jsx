import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { Activity } from "lucide-react";

export default function TelemetryChartCard({ data = [] }) {
  const chartData =
    data.length > 0
      ? data
      : [
          {
            date: "08:00",
            avg_temperature: 33.5,
            avg_humidity: 65,
            total_harvest_kg: 0,
          },
          {
            date: "10:00",
            avg_temperature: 34.2,
            avg_humidity: 62,
            total_harvest_kg: 0,
          },
          {
            date: "12:00",
            avg_temperature: 35.8,
            avg_humidity: 58,
            total_harvest_kg: 12,
          },
          {
            date: "14:00",
            avg_temperature: 36.1,
            avg_humidity: 55,
            total_harvest_kg: 0,
          },
          {
            date: "16:00",
            avg_temperature: 35.0,
            avg_humidity: 59,
            total_harvest_kg: 15,
          },
          {
            date: "18:00",
            avg_temperature: 34.0,
            avg_humidity: 63,
            total_harvest_kg: 0,
          },
        ];

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#2663eb]" />
          <h2 className="text-base font-bold text-[#171c29]">
            Live Telemetry & Yield Trends
          </h2>
        </div>
        <span className="text-xs text-[#707a8c] bg-[#f7fafc] px-3 py-1 rounded-full border border-[#e3e8f0]">
          Optimal Range: 33°C–36°C | 50%–70%
        </span>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 20, bottom: 20, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e3e8f0" />
            <XAxis dataKey="date" stroke="#707a8c" fontSize={12} />
            <YAxis
              yAxisId="temp"
              orientation="left"
              stroke="#eb9917"
              domain={[20, 45]}
              label={{
                value: "Temp (°C)",
                angle: -90,
                position: "insideLeft",
                fontSize: 12,
              }}
            />
            <YAxis
              yAxisId="humidity"
              orientation="right"
              stroke="#2663eb"
              domain={[0, 100]}
              label={{
                value: "Humidity (%)",
                angle: 90,
                position: "insideRight",
                fontSize: 12,
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                borderRadius: "8px",
                borderColor: "#e3e8f0",
              }}
            />
            <Legend verticalAlign="top" height={36} />
            <Bar
              yAxisId="humidity"
              dataKey="total_harvest_kg"
              fill="#17a34a"
              name="Harvest Yield (kg)"
              barSize={20}
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="temp"
              type="monotone"
              dataKey="avg_temperature"
              stroke="#eb9917"
              strokeWidth={2.5}
              name="Temperature (°C)"
              dot={{ r: 3 }}
            />
            <Line
              yAxisId="humidity"
              type="monotone"
              dataKey="avg_humidity"
              stroke="#2663eb"
              strokeWidth={2.5}
              name="Humidity (%)"
              dot={{ r: 3 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
