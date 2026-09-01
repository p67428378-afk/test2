import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Zap,
  ShieldCheck,
  Clock,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import RateBreakdownCard from "../components/rates/RateBreakdownCard";
import { parkingService } from "../services/api";

export default function SpotDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [spot, setSpot] = useState(null);
  const [rates, setRates] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState(null);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const [spotData, rateData] = await Promise.all([
        parkingService.getSpotDetails(id),
        parkingService.getSpotRates(id),
      ]);
      setSpot(spotData);
      setRates(rateData);
    } catch (err) {
      console.error("Failed to load spot details:", err);
      setError("Unable to retrieve details for this parking location.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetails();
    }
  }, [id]);

  const handleToggleStatus = async () => {
    if (!spot) return;
    setStatusUpdating(true);
    setStatusSuccess(null);
    try {
      const isCurrentlyAvailable =
        (spot.status || "AVAILABLE").toUpperCase() === "AVAILABLE";
      const newStatus = isCurrentlyAvailable ? "OCCUPIED" : "AVAILABLE";
      const newAvailable = isCurrentlyAvailable
        ? Math.max(0, (spot.available_spots ?? 1) - 1)
        : Math.min(spot.total_capacity || 50, (spot.available_spots ?? 0) + 1);

      await parkingService.updateSpotStatus(id, newStatus, newAvailable);
      setStatusSuccess(`Status updated to ${newStatus} in real-time.`);
      await fetchDetails();
    } catch (err) {
      console.error("Failed to update spot status:", err);
      setError("Failed to update status. Please try again.");
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="flex items-center gap-3 text-slate-600 font-semibold text-sm">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-700" />
          <span>Loading Parking Facility Details & Rates...</span>
        </div>
      </div>
    );
  }

  if (error || !spot) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 flex flex-col items-center justify-center">
        <div className="bg-white border border-red-200 rounded-xl p-8 max-w-md w-full text-center space-y-4 shadow-sm">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">Spot Not Found</h2>
          <p className="text-xs text-slate-500">
            {error || "The requested parking location could not be loaded."}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-700 text-white rounded-lg text-xs font-semibold hover:bg-blue-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Search Map
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable =
    (spot.status || "AVAILABLE").toUpperCase() === "AVAILABLE" &&
    (spot.available_spots ?? 1) > 0;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-100 transition text-slate-600"
            title="Back to search"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-extrabold text-blue-900 tracking-tight">
            Facility Details & Rate Calculator
          </h1>
        </div>

        <nav className="flex items-center gap-4 text-sm font-semibold">
          <Link
            to="/"
            className="text-slate-600 hover:text-blue-700 transition"
          >
            Search Map
          </Link>
          <Link
            to="/monitor"
            className="text-slate-600 hover:text-blue-700 transition"
          >
            Live Monitor
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-6">
        {/* Spot Summary Banner */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                  isAvailable
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {isAvailable ? "AVAILABLE NOW" : "OCCUPIED / FULL"}
              </span>
              <span className="text-xs text-slate-500 capitalize bg-slate-100 px-2.5 py-0.5 rounded-full font-medium">
                {spot.spot_type ? spot.spot_type.replace("_", " ") : "Garage"}
              </span>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900">
              {spot.name}
            </h1>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{spot.address}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleToggleStatus}
              disabled={statusUpdating}
              className="px-4 py-2.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition disabled:opacity-50"
            >
              {statusUpdating
                ? "Broadcasting..."
                : `Simulate Status Transition`}
            </button>
          </div>
        </div>

        {statusSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{statusSuccess}</span>
          </div>
        )}

        {/* Capacity & Amenities Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              Facility Capacity & Live Status
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-lg border">
                <span className="text-xs text-slate-500 block">
                  Total Capacity
                </span>
                <span className="text-xl font-bold text-slate-800">
                  {spot.total_capacity || 50} spots
                </span>
              </div>
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
                <span className="text-xs text-emerald-800 block">
                  Available Right Now
                </span>
                <span className="text-xl font-bold text-emerald-700">
                  {spot.available_spots ?? 0} spots
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 text-base">
              Amenities & Features
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-600 font-medium">
                  EV Charging Station
                </span>
                <span className="font-bold text-slate-900">
                  {spot.has_ev_charging
                    ? "Available (Level 2/DC Fast)"
                    : "Not Offered"}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-600 font-medium">
                  Peak Rate Windows
                </span>
                <span className="font-bold text-slate-900">
                  Mon-Fri (4 PM - 7 PM)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Rate Breakdown Component */}
        <RateBreakdownCard
          ratesData={
            rates ||
            spot.rates || {
              base_hourly_rate:
                spot.base_hourly_rate || spot.hourly_rate || 5.0,
              current_active_rate:
                spot.current_active_rate || spot.hourly_rate || 5.0,
              is_peak: spot.is_peak || spot.is_peak_hours || false,
              max_daily_cap: 25.0,
              rate_breakdown: {
                standard_rate: `$${(spot.base_hourly_rate || 5).toFixed(2)}/hr`,
                peak_rate: `$${((spot.base_hourly_rate || 5) * 1.5).toFixed(2)}/hr`,
                weekend_rate: `$${(spot.base_hourly_rate || 5).toFixed(2)}/hr`,
              },
            }
          }
          spotId={id}
          spotName={spot.name}
        />
      </main>
    </div>
  );
}
