import React from "react";
import {
  Activity,
  Truck,
  Clock,
  Droplets,
  TrendingUp,
  BarChart3,
} from "lucide-react";

export const AdminAnalyticsKPIs = ({ data = null, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-slate-800 rounded-xl p-5 border border-slate-700 animate-pulse h-28"
          />
        ))}
      </div>
    );
  }

  const analytics = data || {
    total_active_bookings: 0,
    fleet_utilization_rate: 0,
    avg_fulfillment_duration_mins: 0,
    total_volume_liters: 0,
    demand_surge_zone: "North Zone",
  };

  const isEmpty =
    analytics.total_volume_liters === 0 &&
    analytics.total_active_bookings === 0;

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Active Bookings */}
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              Total Active Bookings
            </span>
            <div className="p-2 bg-sky-500/10 rounded-lg text-sky-400">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-100">
              {analytics.total_active_bookings}
            </span>
            <span className="text-xs text-slate-400 ml-2">In Pipeline</span>
          </div>
        </div>

        {/* Card 2: Fleet Utilization */}
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              Fleet Utilization Rate
            </span>
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-100">
              {analytics.fleet_utilization_rate}%
            </span>
            <span className="text-xs text-slate-400 ml-2">Active Tankers</span>
          </div>
        </div>

        {/* Card 3: Volume Delivered */}
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              Total Water Delivered
            </span>
            <div className="p-2 bg-teal-500/10 rounded-lg text-teal-400">
              <Droplets className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-100">
              {analytics.total_volume_liters.toLocaleString()} L
            </span>
            <span className="text-xs text-slate-400 ml-2">Completed</span>
          </div>
        </div>

        {/* Card 4: Avg Fulfillment Time */}
        <div className="bg-slate-800 rounded-xl p-5 border border-slate-700 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">
              Avg Fulfillment Duration
            </span>
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-slate-100">
              {analytics.avg_fulfillment_duration_mins} m
            </span>
            <span className="text-xs text-slate-400 ml-2">Per Delivery</span>
          </div>
        </div>
      </div>

      {/* Demand Surge & Fleet Monitoring Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demand Zone Surge Indicator */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              <h4 className="text-base font-semibold text-slate-100">
                Regional Demand Surge
              </h4>
            </div>
            <span className="text-xs px-2.5 py-0.5 bg-amber-500/20 text-amber-300 rounded-full font-medium border border-amber-500/40">
              +35% Demand Spike
            </span>
          </div>

          <div className="p-4 bg-slate-900 rounded-lg border border-slate-700/80">
            <div className="text-xs text-slate-400 uppercase font-mono tracking-wider">
              Top Demand Hotspot
            </div>
            <div className="text-xl font-bold text-sky-300 mt-1">
              {analytics.demand_surge_zone}
            </div>
            <p className="text-xs text-slate-400 mt-2">
              High density of water delivery requests detected in this region.
              Proactive tanker dispatch recommended.
            </p>
          </div>
        </div>

        {/* System Activity Summary / Clean Empty-State */}
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-sky-400" />
            <h4 className="text-base font-semibold text-slate-100">
              System Fulfillment Overview
            </h4>
          </div>

          {isEmpty ? (
            <div className="p-8 bg-slate-900/60 rounded-lg border border-dashed border-slate-700 text-center">
              <BarChart3 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-sm text-slate-300 font-medium">
                Zero Completed Deliveries in Filter Period
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Fulfillment metrics will populate as drivers complete active
                orders.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400">
                  Total Water Volume Fulfilled
                </span>
                <span className="font-semibold text-teal-300">
                  {analytics.total_volume_liters.toLocaleString()} Liters
                </span>
              </div>
              <div className="flex justify-between items-center text-sm p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400">
                  Fleet Active Capacity Rate
                </span>
                <span className="font-semibold text-blue-300">
                  {analytics.fleet_utilization_rate}%
                </span>
              </div>
              <div className="flex justify-between items-center text-sm p-3 bg-slate-900 rounded-lg border border-slate-800">
                <span className="text-slate-400">Average Turnaround Time</span>
                <span className="font-semibold text-purple-300">
                  {analytics.avg_fulfillment_duration_mins} Minutes
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalyticsKPIs;
