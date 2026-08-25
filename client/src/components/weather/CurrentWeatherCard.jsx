import React from "react";
import { Thermometer, Droplets, Wind, Compass } from "lucide-react";

export default function CurrentWeatherCard({ weather, city, units }) {
  if (!weather) return null;

  const { temp, humidity, wind_speed, pressure, description, icon } = weather;
  const tempUnit = units === "metric" ? "°C" : "°F";
  const windUnit = units === "metric" ? "m/s" : "mph";

  return (
    <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left: City & Main Temp */}
        <div>
          <h2 className="text-2xl font-bold text-[#171c29]">
            {city.name}
            {city.state ? `, ${city.state}` : ""}
          </h2>
          <p className="text-sm text-[#707a8c] mb-4">{city.country}</p>

          <div className="flex items-center gap-4">
            <div className="bg-[#f0f5ff] p-2 rounded-lg">
              <img
                src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                alt={description}
                className="size-16 object-contain"
                onError={(e) => {
                  e.target.src = "https://openweathermap.org/img/wn/10d@2x.png";
                }}
              />
            </div>
            <div>
              <div className="text-5xl font-extrabold text-[#171c29] tracking-tight">
                {Math.round(temp)}
                {tempUnit}
              </div>
              <p className="text-sm font-medium text-[#707a8c] capitalize mt-1">
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 flex-1 max-w-md">
          <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e3e8f0] flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
              <Thermometer className="size-5" />
            </div>
            <div>
              <p className="text-xs text-[#707a8c] font-medium">Temperature</p>
              <p className="text-sm font-bold text-[#171c29]">
                {Math.round(temp)}
                {tempUnit}
              </p>
            </div>
          </div>

          <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e3e8f0] flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
              <Droplets className="size-5" />
            </div>
            <div>
              <p className="text-xs text-[#707a8c] font-medium">Humidity</p>
              <p className="text-sm font-bold text-[#171c29]">{humidity}%</p>
            </div>
          </div>

          <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e3e8f0] flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
              <Wind className="size-5" />
            </div>
            <div>
              <p className="text-xs text-[#707a8c] font-medium">Wind Speed</p>
              <p className="text-sm font-bold text-[#171c29]">
                {wind_speed} {windUnit}
              </p>
            </div>
          </div>

          <div className="bg-[#f8fafc] p-4 rounded-xl border border-[#e3e8f0] flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
              <Compass className="size-5" />
            </div>
            <div>
              <p className="text-xs text-[#707a8c] font-medium">Pressure</p>
              <p className="text-sm font-bold text-[#171c29]">{pressure} hPa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
