import React, { useState } from "react";
import {
  DollarSign,
  Clock,
  Calendar,
  AlertCircle,
  Calculator,
  CheckCircle2,
} from "lucide-react";
import { parkingService } from "../../services/api";

export default function RateBreakdownCard({ ratesData, spotId, spotName }) {
  const [hours, setHours] = useState(2);
  const [startTime, setStartTime] = useState("09:00");
  const [estimate, setEstimate] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState(null);

  if (!ratesData) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 text-slate-500 text-sm">
        No rate breakdown information available for this spot.
      </div>
    );
  }

  const {
    base_hourly_rate,
    current_active_rate,
    is_peak,
    max_daily_cap,
    currency = "USD",
    rate_breakdown = {},
  } = ratesData;

  const handleCalculateCost = async (e) => {
    e.preventDefault();
    if (!spotId) return;
    setIsCalculating(true);
    setError(null);
    try {
      const res = await parkingService.calculateCost(
        spotId,
        parseFloat(hours),
        startTime,
      );
      setEstimate(res);
    } catch (err) {
      console.error("Failed to calculate parking cost:", err);
      setError("Unable to calculate estimate. Please try again.");
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Rate Overview Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-emerald-600" />
              Hourly Rate Structure
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Transparent pricing breakdown & maximum daily caps
            </p>
          </div>

          <div className="text-right">
            <div className="text-2xl font-extrabold text-blue-800">
              ${(current_active_rate || base_hourly_rate || 5.0).toFixed(2)}
              <span className="text-xs font-normal text-slate-500">/hr</span>
            </div>
            {is_peak ? (
              <span className="inline-block mt-1 px-2.5 py-0.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-200">
                Peak Hours Rate Active
              </span>
            ) : (
              <span className="inline-block mt-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full border border-emerald-200">
                Standard Off-Peak Rate
              </span>
            )}
          </div>
        </div>

        {/* Rate Breakdown Table / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <span className="text-xs text-slate-500 font-medium block">
              Standard Rate
            </span>
            <span className="text-lg font-bold text-slate-900 mt-1 block">
              {rate_breakdown.standard_rate ||
                `$${(base_hourly_rate || 5).toFixed(2)}/hr`}
            </span>
            <span className="text-[11px] text-slate-400">
              Regular hours (7 AM - 4 PM)
            </span>
          </div>

          <div className="bg-amber-50/60 p-4 rounded-lg border border-amber-200">
            <span className="text-xs text-amber-800 font-medium block">
              Peak Rate
            </span>
            <span className="text-lg font-bold text-amber-900 mt-1 block">
              {rate_breakdown.peak_rate ||
                `$${((base_hourly_rate || 5) * 1.5).toFixed(2)}/hr`}
            </span>
            <span className="text-[11px] text-amber-700">
              Rush hours (4 PM - 7 PM)
            </span>
          </div>

          <div className="bg-blue-50/60 p-4 rounded-lg border border-blue-200">
            <span className="text-xs text-blue-800 font-medium block">
              Max Daily Cap
            </span>
            <span className="text-lg font-bold text-blue-900 mt-1 block">
              ${(max_daily_cap || 25.0).toFixed(2)} / day
            </span>
            <span className="text-[11px] text-blue-700">
              24-hour maximum charge
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Parking Cost Estimator */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-xl border border-slate-800 text-white shadow-md">
        <div className="flex items-center gap-2 mb-4">
          <Calculator className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-base text-slate-100">
            Estimate Total Parking Cost
          </h3>
        </div>

        <form onSubmit={handleCalculateCost} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Duration:{" "}
                <span className="text-blue-400 font-bold">{hours} hours</span>
              </label>
              <input
                type="range"
                min="0.5"
                max="24"
                step="0.5"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>30 mins</span>
                <span>12 hrs</span>
                <span>24 hrs (Full Day)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Planned Arrival Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isCalculating}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-sm transition shadow-sm disabled:opacity-50"
          >
            {isCalculating
              ? "Calculating Estimate..."
              : "Calculate Estimated Total Cost"}
          </button>
        </form>

        {error && (
          <div className="mt-3 p-3 bg-red-950/80 border border-red-800 rounded-lg text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {estimate && (
          <div className="mt-4 p-4 bg-slate-800/80 border border-blue-500/40 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between items-center text-sm font-bold text-white border-b border-slate-700 pb-2">
              <span>Estimated Total Cost:</span>
              <span className="text-xl text-emerald-400">
                ${estimate.estimated_cost?.toFixed(2)}{" "}
                {estimate.currency || "USD"}
              </span>
            </div>

            <div className="flex justify-between text-slate-300">
              <span>Applied Hourly Rate:</span>
              <span className="font-semibold">
                ${estimate.applied_rate_per_hour?.toFixed(2)}/hr
              </span>
            </div>

            {estimate.capped_at_daily_max && (
              <div className="flex items-center gap-1.5 text-blue-300 font-semibold text-[11px] pt-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                <span>
                  Capped at Daily Maximum (${max_daily_cap?.toFixed(2)})
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
