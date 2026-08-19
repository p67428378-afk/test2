import React, { useState, useEffect } from "react";
import CostAnalyticsCard from "../components/CostAnalyticsCard";
import { getCostSummary, getTasks } from "../services/api";
import { TrendingDown, TrendingUp, CheckCircle2, Clock } from "lucide-react";

export default function CostAnalyticsPage() {
  const [summary, setSummary] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError("");
      try {
        const [sumRes, tasksRes] = await Promise.all([
          getCostSummary(),
          getTasks({ limit: 100 }),
        ]);
        setSummary(sumRes || {});
        setTasks(tasksRes?.items || []);
      } catch (err) {
        console.error("Failed to load cost analytics:", err);
        setError("Error loading cost analytics data.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const completedTasks = tasks.filter(
    (t) => t.status?.toLowerCase() === "completed",
  );

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-[#171c29]">
          Cost Tracking & Budget Analytics
        </h1>
        <p className="text-sm text-[#707a8c] mt-1">
          Detailed overview of estimated vs actual maintenance expenditures and
          cost variance.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl"
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="p-8 text-center text-[#707a8c]">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-solid border-[#1f40b0] border-r-transparent align-[-0.125em]" />
          <p className="mt-2 text-sm font-medium">
            Calculating budget metrics...
          </p>
        </div>
      ) : (
        <>
          <CostAnalyticsCard summary={summary} />

          {/* Completed Task Cost Log */}
          <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm flex flex-col gap-4">
            <h2 className="text-lg font-bold text-[#171c29]">
              Completed Task Cost Audit Log
            </h2>
            {completedTasks.length === 0 ? (
              <p className="text-sm text-[#707a8c]">
                No completed maintenance tasks to log.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-[#f7fafc] border-b border-[#e3e8f0] text-[#707a8c] font-medium text-xs uppercase">
                      <th className="py-3 px-4">Task Name</th>
                      <th className="py-3 px-4">Equipment / Location</th>
                      <th className="py-3 px-4">Estimated Cost</th>
                      <th className="py-3 px-4">Actual Cost</th>
                      <th className="py-3 px-4">Variance</th>
                      <th className="py-3 px-4">Resolution Summary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e3e8f0] text-[#171c29]">
                    {completedTasks.map((t) => {
                      const est = t.estimated_cost || 0;
                      const act = t.actual_cost || 0;
                      const diff = act - est;
                      return (
                        <tr key={t.id} className="hover:bg-gray-50/50">
                          <td className="py-3 px-4 font-semibold">{t.title}</td>
                          <td className="py-3 px-4 text-[#707a8c]">
                            {t.location_equipment}
                          </td>
                          <td className="py-3 px-4">${est.toFixed(2)}</td>
                          <td className="py-3 px-4 font-bold text-[#1f40b0]">
                            ${act.toFixed(2)}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1 font-semibold text-xs px-2 py-0.5 rounded ${
                                diff <= 0
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-red-50 text-red-700"
                              }`}
                            >
                              {diff <= 0 ? (
                                <TrendingDown className="w-3 h-3" />
                              ) : (
                                <TrendingUp className="w-3 h-3" />
                              )}
                              {diff > 0
                                ? `+$${diff.toFixed(2)}`
                                : `-$${Math.abs(diff).toFixed(2)}`}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-xs text-[#707a8c] max-w-xs truncate">
                            {t.resolution_notes || "N/A"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
