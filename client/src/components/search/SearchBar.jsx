import React, { useState } from "react";
import { Search, MapPin, Navigation } from "lucide-react";

export default function SearchBar({
  onSearch,
  initialAddress = "123 Main St, San Francisco, CA",
}) {
  const [address, setAddress] = useState(initialAddress);
  const [isLocating, setIsLocating] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ address });
    }
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        if (onSearch) {
          onSearch({
            lat: latitude,
            lng: longitude,
            address: `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
          });
        }
      },
      (error) => {
        setIsLocating(false);
        alert(`Unable to retrieve your location: ${error.message}`);
      },
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center"
    >
      <div className="relative flex-1 w-full">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Search by address or location (e.g. 123 Main St)..."
          className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm"
        />
      </div>

      <div className="flex gap-2 w-full md:w-auto">
        <button
          type="button"
          onClick={handleUseLocation}
          disabled={isLocating}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition text-sm font-medium disabled:opacity-50"
          title="Use my current geolocation"
        >
          <Navigation
            className={`w-4 h-4 ${isLocating ? "animate-spin" : "text-blue-600"}`}
          />
          <span>{isLocating ? "Locating..." : "Near Me"}</span>
        </button>

        <button
          type="submit"
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-semibold text-sm transition shadow-sm"
        >
          <Search className="w-4 h-4" />
          <span>Search Open Spots</span>
        </button>
      </div>
    </form>
  );
}
