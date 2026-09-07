import React from "react";
import { Tag } from "lucide-react";

export default function TopTopicsWidget({ topics = [] }) {
  const defaultTopics = [
    {
      name: "UI Usability & Design",
      count: 0,
      percentage: 0,
      sentiment: "Positive",
    },
    {
      name: "Payment Processing",
      count: 0,
      percentage: 0,
      sentiment: "Negative",
    },
    {
      name: "Customer Support Response",
      count: 0,
      percentage: 0,
      sentiment: "Positive",
    },
    { name: "Feature Requests", count: 0, percentage: 0, sentiment: "Neutral" },
  ];

  const items = topics.length > 0 ? topics : defaultTopics;

  return (
    <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 backdrop-blur">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Tag className="w-4 h-4 text-indigo-400" />
          Top AI Extracted Issue Categories
        </h2>
        <span className="text-xs text-slate-400">Recurring Topics</span>
      </div>

      <div className="space-y-3">
        {items.map((topic, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-800 rounded-xl"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 w-4">
                #{idx + 1}
              </span>
              <span className="text-sm font-medium text-slate-200">
                {topic.name}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-400 font-mono">
                {topic.count} mentions ({topic.percentage}%)
              </span>
              <span
                className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                  topic.sentiment?.toLowerCase() === "positive"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : topic.sentiment?.toLowerCase() === "negative"
                      ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                }`}
              >
                {topic.sentiment || "Neutral"}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
