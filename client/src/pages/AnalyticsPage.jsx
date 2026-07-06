import React, { useState, useEffect } from "react";
import DetailedBreakdownTable from "../components/analytics/DetailedBreakdownTable";
import { analyticsService } from "../services/api";
import {
  BarChart3,
  Calendar,
  Filter,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Zap,
} from "lucide-react";

export default function AnalyticsPage() {
  const [startDate, setStartDate] = useState("2026-01-01");
  const [endDate, setEndDate] = useState("2026-01-31");
  const [source, setSource] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const result = await analyticsService.getHistory(
        startDate,
        endDate,
        source,
      );
      setData(result);
      setError(null);
    } catch (err) {
      setError(
        "Failed to load historical analytics. Please check your filters.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [startDate, endDate, source]);

  const summary = data?.summary || {
    total_generation_kwh: 0,
    total_consumption_kwh: 0,
    net_cost_usd: 0,
  };

  return (
    <div className="space-y-8">
      {/* Filter Bar */}
      <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-6 shadow-lg flex flex-wrap gap-6 items-end justify-between">
        <div className="flex flex-wrap gap-6 items-center">
          {/* Start Date */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#10B981]"
            />
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#10B981]"
            />
          </div>

          {/* Source Filter */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5" /> Energy Source
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-[#F8FAFC] focus:outline-none focus:border-[#10B981]"
            >
              <option value="">All Sources</option>
              <option value="solar">Solar</option>
              <option value="wind">Wind</option>
              <option value="battery">Battery</option>
              <option value="grid">Grid</option>
            </select>
          </div>
        </div>

        <button
          onClick={fetchHistory}
          className="bg-[#10B981] hover:bg-emerald-500 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          Apply Filters
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-400">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-6 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-lg text-[#10B981]">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">
              Total Generation
            </span>
            <span className="text-2xl font-bold text-[#F8FAFC] font-mono mt-1 block">
              {summary.total_generation_kwh.toFixed(1)} kWh
            </span>
          </div>
        </div>

        <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-6 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-sky-500/10 rounded-lg text-sky-400">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">
              Total Consumption
            </span>
            <span className="text-2xl font-bold text-[#F8FAFC] font-mono mt-1 block">
              {summary.total_consumption_kwh.toFixed(1)} kWh
            </span>
          </div>
        </div>

        <div className="bg-[#1E293B] border border-slate-800 rounded-xl p-6 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-lg text-amber-500">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">
              Net Energy Cost
            </span>
            <span className="text-2xl font-bold text-[#F8FAFC] font-mono mt-1 block">
              ${summary.net_cost_usd.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown Table */}
      <DetailedBreakdownTable dataPoints={data?.data_points || []} />
    </div>
  );
}
