import React, { useState, useEffect } from "react";
import { AdminAnalyticsKPIs } from "../components/AdminAnalyticsKPIs";
import { adminApi } from "../services/api";
import { wsService } from "../services/websocket";
import { ShieldCheck, RefreshCw } from "lucide-react";

export const AdminPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const data = await adminApi.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error("Failed to fetch admin analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    const unsubscribe = wsService.addListener((message) => {
      if (
        ["BOOKING_ASSIGNED", "DELIVERY_STATUS_UPDATED"].includes(message.event)
      ) {
        fetchAnalytics();
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-100">
              Executive Monitoring & Demand Analytics
            </h1>
            <p className="text-slate-400 text-sm">
              Real-time metrics, fleet utilization, and demand surge patterns.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchAnalytics}
          className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition flex items-center gap-2 text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh</span>
        </button>
      </div>

      <AdminAnalyticsKPIs data={analytics} loading={loading} />
    </div>
  );
};

export default AdminPage;
