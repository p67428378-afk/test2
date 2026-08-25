import React, { useState, useEffect } from "react";
import Navbar from "../components/layout/Navbar";
import SearchBar from "../components/weather/SearchBar";
import CurrentWeatherCard from "../components/weather/CurrentWeatherCard";
import TrendChartCard from "../components/weather/TrendChartCard";
import ForecastCard from "../components/weather/ForecastCard";
import { getWeatherForecast } from "../services/api";
import { Loader2, AlertCircle } from "lucide-react";

const DEFAULT_CITY = {
  id: "seattle-default",
  name: "Seattle",
  state: "WA",
  country: "US",
  latitude: 47.6062,
  longitude: -122.3321,
};

export default function DashboardPage() {
  const [selectedCity, setSelectedCity] = useState(DEFAULT_CITY);
  const [units, setUnits] = useState(() => {
    const saved = localStorage.getItem("weather_units");
    return saved || "metric";
  });
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("DashboardPage mounted, selectedCity:", selectedCity);
    localStorage.setItem("weather_units", units);
  }, [units]);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!selectedCity) return;
      setLoading(true);
      setError(null);
      try {
        console.log(
          "Calling getWeatherForecast with:",
          selectedCity.latitude,
          selectedCity.longitude,
          units,
        );
        const data = await getWeatherForecast(
          selectedCity.latitude,
          selectedCity.longitude,
          units,
        );
        console.log("getWeatherForecast returned:", data);
        setWeatherData(data);
      } catch (err) {
        console.error("getWeatherForecast error:", err);
        setError(
          err.response?.data?.detail ||
            "External weather service is currently unavailable. Please try again later.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [selectedCity, units]);

  const handleToggleUnits = () => {
    setUnits((prev) => (prev === "metric" ? "imperial" : "metric"));
  };

  return (
    <div className="min-h-screen bg-[#f7fafc] flex flex-col">
      <Navbar units={units} onToggleUnits={handleToggleUnits} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 md:px-8">
        <SearchBar onSelectCity={setSelectedCity} />

        {loading && !weatherData ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="size-10 animate-spin text-[#2663eb] mb-4" />
            <p className="text-sm text-[#707a8c] font-medium">
              Loading weather data...
            </p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-xl mx-auto flex items-start gap-4">
            <AlertCircle className="size-6 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-red-800 mb-1">Service Error</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        ) : weatherData ? (
          <div className="space-y-8">
            {/* Current Weather */}
            <CurrentWeatherCard
              weather={weatherData.current}
              city={selectedCity}
              units={units}
            />

            {/* Trend Chart & Forecast */}
            <div className="grid grid-cols-1 gap-8">
              <TrendChartCard
                hourlyForecasts={weatherData.hourly_forecasts}
                units={units}
              />
              <ForecastCard
                dailyForecasts={weatherData.daily_forecasts}
                units={units}
              />
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
