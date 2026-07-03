import React, { useState, useEffect } from "react";
import { reportService, taskService } from "../services/api";

export default function DashboardPage({ onNewTask }) {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        const data = await reportService.getDashboardMetrics();
        setMetrics(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch dashboard metrics:", err);
        setError(
          "Failed to load dashboard metrics. Please make sure you are logged in as a manager.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-outline">
        <span className="material-symbols-outlined animate-spin mr-2">
          sync
        </span>
        Loading dashboard metrics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-md bg-error/10 border border-error/20 rounded-lg text-error text-center max-w-2xl mx-auto">
        <span className="material-symbols-outlined text-3xl mb-2">warning</span>
        <p className="font-medium">{error}</p>
        <p className="text-xs mt-1 text-outline">
          Note: The dashboard requires a manager role (e.g.,
          manager@example.com).
        </p>
      </div>
    );
  }

  const {
    total_tasks = 0,
    completed_tasks = 0,
    in_progress_tasks = 0,
    overdue_tasks = 0,
    tasks_by_priority = { High: 0, Med: 0, Low: 0 },
    completion_trend = [],
  } = metrics || {};

  const completionRate =
    total_tasks > 0 ? Math.round((completed_tasks / total_tasks) * 100) : 0;

  return (
    <div className="space-y-lg">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface">
            Dashboard
          </h1>
          <p className="font-body-md text-body-md text-outline mt-xs">
            Overview of your current projects and tasks.
          </p>
        </div>
        <button
          onClick={onNewTask}
          className="bg-inverse-primary text-white font-label-md text-label-md px-md py-sm rounded-md shadow-sm hover:bg-primary-container transition-colors active:scale-95 flex items-center gap-xs"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Task
        </button>
      </div>

      {/* KPI Grid (Bento Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        <div className="bg-[#2D3748] rounded-lg p-md border border-white/5 shadow-sm hover:bg-[#323d50] transition-all duration-300 group cursor-pointer relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-md relative z-10">
            <span className="font-label-md text-label-md text-outline uppercase tracking-wider">
              Total Tasks
            </span>
            <div className="p-sm bg-primary-container/10 rounded-md">
              <span className="material-symbols-outlined text-primary text-[20px]">
                fact_check
              </span>
            </div>
          </div>
          <div className="flex items-end gap-sm relative z-10">
            <span className="font-headline-xl text-headline-xl text-on-surface">
              {total_tasks}
            </span>
          </div>
        </div>

        <div className="bg-[#2D3748] rounded-lg p-md border border-white/5 shadow-sm hover:bg-[#323d50] transition-all duration-300 group cursor-pointer relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary-container/5 rounded-full blur-xl group-hover:bg-secondary-container/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-md relative z-10">
            <span className="font-label-md text-label-md text-outline uppercase tracking-wider">
              Completed
            </span>
            <div className="p-sm bg-secondary-container/10 rounded-md">
              <span className="material-symbols-outlined text-secondary-container text-[20px]">
                check_circle
              </span>
            </div>
          </div>
          <div className="flex items-end gap-sm relative z-10">
            <span className="font-headline-xl text-headline-xl text-on-surface">
              {completed_tasks}
            </span>
            <span className="font-label-sm text-label-sm text-outline mb-1">
              {completionRate}%
            </span>
          </div>
          <div className="w-full bg-[#0F172A] h-1.5 rounded-full mt-sm relative z-10 overflow-hidden">
            <div
              className="bg-secondary-container h-full rounded-full"
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-[#2D3748] rounded-lg p-md border border-white/5 shadow-sm hover:bg-[#323d50] transition-all duration-300 group cursor-pointer relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-tertiary-container/5 rounded-full blur-xl group-hover:bg-tertiary-container/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-md relative z-10">
            <span className="font-label-md text-label-md text-outline uppercase tracking-wider">
              In Progress
            </span>
            <div className="p-sm bg-tertiary-container/10 rounded-md">
              <span className="material-symbols-outlined text-tertiary-container text-[20px]">
                pending_actions
              </span>
            </div>
          </div>
          <div className="flex items-end gap-sm relative z-10">
            <span className="font-headline-xl text-headline-xl text-on-surface">
              {in_progress_tasks}
            </span>
            <span className="font-label-sm text-label-sm text-outline mb-1">
              On track
            </span>
          </div>
        </div>

        <div className="bg-[#2D3748] rounded-lg p-md border border-white/5 shadow-sm hover:bg-[#323d50] transition-all duration-300 group cursor-pointer relative overflow-hidden border-l-4 border-l-error">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-error/5 rounded-full blur-xl group-hover:bg-error/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-md relative z-10">
            <span className="font-label-md text-label-md text-outline uppercase tracking-wider">
              Overdue
            </span>
            <div className="p-sm bg-error/10 rounded-md">
              <span className="material-symbols-outlined text-error text-[20px]">
                warning
              </span>
            </div>
          </div>
          <div className="flex items-end gap-sm relative z-10">
            <span className="font-headline-xl text-headline-xl text-on-surface">
              {overdue_tasks}
            </span>
            {overdue_tasks > 0 && (
              <span className="font-label-sm text-label-sm text-error bg-error/10 px-xs py-[2px] rounded-sm mb-1">
                Needs Attention
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {/* Bar Chart Area (Mockup) */}
        <div className="lg:col-span-2 bg-[#2D3748] rounded-lg p-md border border-white/5 shadow-sm">
          <div className="flex justify-between items-center mb-md">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Tasks Completed (Last 7 Days)
            </h2>
          </div>
          <div className="h-[240px] w-full flex items-end justify-around gap-2 pb-4 pt-8 relative">
            {/* Y-axis lines */}
            <div className="absolute w-full h-full flex flex-col justify-between pointer-events-none pb-4 border-b border-white/5">
              <div className="border-b border-white/5 w-full flex-1"></div>
              <div className="border-b border-white/5 w-full flex-1"></div>
              <div className="border-b border-white/5 w-full flex-1"></div>
              <div className="border-b border-white/5 w-full flex-1"></div>
            </div>
            {/* Bars */}
            {completion_trend.map((item, idx) => {
              const maxVal = Math.max(
                ...completion_trend.map((t) => t.completed),
                1,
              );
              const heightPercent =
                Math.round((item.completed / maxVal) * 80) + 10; // scale between 10% and 90%
              return (
                <div
                  key={idx}
                  className="w-8 md:w-12 bg-primary/20 rounded-t-sm relative group hover:bg-primary/40 transition-colors z-10 flex-shrink-0"
                  style={{ height: `${heightPercent}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-[#0F172A] text-xs px-2 py-1 rounded transition-opacity font-label-sm whitespace-nowrap">
                    {item.completed} completed
                  </div>
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-outline font-label-sm text-[10px]">
                    {item.day}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Donut Chart Area (Mockup) */}
        <div className="bg-[#2D3748] rounded-lg p-md border border-white/5 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-md">
            <h2 className="font-headline-md text-headline-md text-on-surface">
              Tasks by Priority
            </h2>
          </div>
          <div className="flex-1 flex items-center justify-center relative py-4">
            {/* CSS Donut Chart Mockup */}
            <div
              className="w-40 h-40 rounded-full border-[16px] border-[#0F172A] relative flex items-center justify-center"
              style={{
                background: `conic-gradient(#ef4444 0% ${total_tasks > 0 ? (tasks_by_priority.High / total_tasks) * 100 : 0}%, #d97721 ${total_tasks > 0 ? (tasks_by_priority.High / total_tasks) * 100 : 0}% ${total_tasks > 0 ? ((tasks_by_priority.High + tasks_by_priority.Med) / total_tasks) * 100 : 0}%, #c0c1ff ${total_tasks > 0 ? ((tasks_by_priority.High + tasks_by_priority.Med) / total_tasks) * 100 : 0}% 100%)`,
              }}
            >
              <div className="w-32 h-32 bg-[#2D3748] rounded-full flex flex-col items-center justify-center absolute">
                <span className="font-headline-lg text-headline-lg text-on-surface">
                  {total_tasks}
                </span>
                <span className="font-label-sm text-label-sm text-outline">
                  Total
                </span>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-md mt-sm">
            <div className="flex items-center gap-xs font-label-sm text-label-sm text-outline">
              <span className="w-2 h-2 rounded-full bg-error"></span> High (
              {tasks_by_priority.High})
            </div>
            <div className="flex items-center gap-xs font-label-sm text-label-sm text-outline">
              <span className="w-2 h-2 rounded-full bg-tertiary-container"></span>{" "}
              Med ({tasks_by_priority.Med})
            </div>
            <div className="flex items-center gap-xs font-label-sm text-label-sm text-outline">
              <span className="w-2 h-2 rounded-full bg-primary"></span> Low (
              {tasks_by_priority.Low})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
