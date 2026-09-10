import React from "react";
import {
  Mail,
  Briefcase,
  User,
  AlertOctagon,
  Tag,
  ShieldCheck,
} from "lucide-react";

export default function MetricsOverviewGrid({
  emails = [],
  onSelectCategory,
  activeCategory = "All",
}) {
  // Aggregate stats from the current dataset
  const total = emails.length;
  const counts = {
    Work: 0,
    Personal: 0,
    Urgent: 0,
    Promotional: 0,
    Overridden: 0,
  };

  emails.forEach((e) => {
    const cat =
      e.classification?.user_override_category ||
      e.classification?.primary_category ||
      e.classification?.ai_category;
    if (cat && counts[cat] !== undefined) {
      counts[cat] += 1;
    }
    if (e.classification?.is_overridden) {
      counts.Overridden += 1;
    }
  });

  const cards = [
    {
      id: "All",
      label: "Total Processed",
      count: total,
      percentage: "100%",
      icon: Mail,
      bg: "bg-indigo-50 border-indigo-200 text-indigo-700",
      iconBg: "bg-indigo-100 text-indigo-700",
    },
    {
      id: "Work",
      label: "Work & Operations",
      count: counts.Work,
      percentage:
        total > 0 ? `${((counts.Work / total) * 100).toFixed(0)}%` : "0%",
      icon: Briefcase,
      bg: "bg-blue-50 border-blue-200 text-blue-700",
      iconBg: "bg-blue-100 text-blue-700",
    },
    {
      id: "Urgent",
      label: "Urgent Priority",
      count: counts.Urgent,
      percentage:
        total > 0 ? `${((counts.Urgent / total) * 100).toFixed(0)}%` : "0%",
      icon: AlertOctagon,
      bg: "bg-rose-50 border-rose-200 text-rose-700",
      iconBg: "bg-rose-100 text-rose-700",
    },
    {
      id: "Promotional",
      label: "Promotional & Deals",
      count: counts.Promotional,
      percentage:
        total > 0
          ? `${((counts.Promotional / total) * 100).toFixed(0)}%`
          : "0%",
      icon: Tag,
      bg: "bg-purple-50 border-purple-200 text-purple-700",
      iconBg: "bg-purple-100 text-purple-700",
    },
    {
      id: "Personal",
      label: "Personal & Social",
      count: counts.Personal,
      percentage:
        total > 0 ? `${((counts.Personal / total) * 100).toFixed(0)}%` : "0%",
      icon: User,
      bg: "bg-emerald-50 border-emerald-200 text-emerald-700",
      iconBg: "bg-emerald-100 text-emerald-700",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const isSelected =
          activeCategory.toLowerCase() === card.id.toLowerCase();

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectCategory && onSelectCategory(card.id)}
            className={`p-4 rounded-2xl border text-left transition-all ${
              isSelected
                ? "ring-2 ring-indigo-500 bg-white shadow-md border-indigo-300 scale-[1.02]"
                : "bg-white hover:bg-slate-50/80 border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-500 truncate">
                {card.label}
              </span>
              <div className={`p-2 rounded-xl ${card.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {card.count}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {card.percentage}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
