import React from "react";
import { CheckCircle2, Clock, AlertTriangle, ListTodo } from "lucide-react";

export default function StatsOverview({ stats }) {
  const {
    total_tasks = 0,
    completed_tasks = 0,
    in_progress_tasks = 0,
    overdue_tasks = 0,
    completion_rate = 0,
  } = stats || {};

  const cards = [
    {
      title: "Total Tasks",
      value: total_tasks,
      icon: ListTodo,
      color: "text-[#2663eb]",
      bg: "bg-[#2663eb]/10",
    },
    {
      title: "Completed",
      value: completed_tasks,
      icon: CheckCircle2,
      color: "text-[#17a34a]",
      bg: "bg-[#17a34a]/10",
    },
    {
      title: "In Progress",
      value: in_progress_tasks,
      icon: Clock,
      color: "text-[#f59e0b]",
      bg: "bg-[#f59e0b]/10",
    },
    {
      title: "Overdue",
      value: overdue_tasks,
      icon: AlertTriangle,
      color: "text-[#db2626]",
      bg: "bg-[#db2626]/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm flex items-center justify-between"
            >
              <div>
                <p className="text-sm font-medium text-[#707a8c]">
                  {card.title}
                </p>
                <p className="text-3xl font-bold text-[#171c29] mt-2">
                  {card.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${card.bg} ${card.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Rate Progress Card */}
      <div className="bg-white border border-[#e3e8f0] rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-[#171c29]">
              Productivity & Completion Rate
            </h3>
            <p className="text-sm text-[#707a8c]">
              Percentage of tasks completed successfully
            </p>
          </div>
          <span className="text-2xl font-bold text-[#2663eb]">
            {completion_rate.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-[#e3e8f0] h-3 rounded-full overflow-hidden">
          <div
            className="bg-[#2663eb] h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, completion_rate))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
