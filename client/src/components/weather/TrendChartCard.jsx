import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function TrendChartCard({ hourlyForecasts, units }) {
  if (!hourlyForecasts || hourlyForecasts.length === 0) {
    return (
      <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm w-full flex flex-col items-center justify-center min-h-[300px]">
        <p className="text-[#707a8c] font-medium">No trend data available</p>
      </div>
    );
  }

  const tempUnit = units === "metric" ? "°C" : "°F";

  // Format data for Recharts
  const chartData = hourlyForecasts.map((item) => ({
    name: `${item.date.split("-")[2]} ${item.time}`,
    temp: Math.round(item.temp),
    description: item.description,
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-[#e3e8f0] p-3 rounded-lg shadow-md text-xs">
          <p className="font-bold text-[#171c29]">{payload[0].payload.name}</p>
          <p className="text-[#2663eb] font-semibold mt-1">
            Temp: {payload[0].value}
            {tempUnit}
          </p>
          <p className="text-[#707a8c] capitalize mt-0.5">
            {payload[0].payload.description}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm w-full">
      <h3 className="text-lg font-bold text-[#171c29] mb-6">
        Temperature Trend (Next 48 Hours)
      </h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="name"
              stroke="#707a8c"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#707a8c"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              domain={["auto", "auto"]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#2663eb"
              strokeWidth={3}
              activeDot={{ r: 6 }}
              dot={{ r: 3, strokeWidth: 1 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
