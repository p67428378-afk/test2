import React from "react";

export default function ForecastCard({ dailyForecasts, units }) {
  if (!dailyForecasts || dailyForecasts.length === 0) return null;

  const tempUnit = units === "metric" ? "°C" : "°F";

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm w-full">
      <h3 className="text-lg font-bold text-[#171c29] mb-6">5-Day Forecast</h3>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
        {dailyForecasts.map((day, index) => (
          <div
            key={day.date}
            className="bg-[#f8fafc] border border-[#e3e8f0] rounded-xl p-4 flex flex-col items-center text-center transition-all hover:shadow-sm"
          >
            <p className="text-sm font-bold text-[#171c29]">
              {index === 0 ? "Today" : day.day_of_week.substring(0, 3)}
            </p>
            <p className="text-xs text-[#707a8c] mt-0.5">
              {day.date.split("-")[1]}/{day.date.split("-")[2]}
            </p>

            <div className="my-3 bg-white p-1.5 rounded-lg border border-[#f1f5f9]">
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`}
                alt={day.description}
                className="size-12 object-contain"
                onError={(e) => {
                  e.target.src = "https://openweathermap.org/img/wn/10d@2x.png";
                }}
              />
            </div>

            <p className="text-xs font-medium text-[#707a8c] capitalize truncate w-full px-1 mb-3">
              {day.description}
            </p>

            <div className="flex items-center gap-2 mt-auto">
              <span className="text-sm font-bold text-[#171c29]">
                {Math.round(day.temp_max)}
                {tempUnit}
              </span>
              <span className="text-xs text-[#707a8c]">
                {Math.round(day.temp_min)}
                {tempUnit}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
