import React from "react";
import { BookOpen, GraduationCap, Users, RefreshCw } from "lucide-react";

export default function StatCardGroup({
  teachCount = 0,
  learnCount = 0,
  matchesCount = 0,
  pendingExchangesCount = 0,
}) {
  const stats = [
    {
      label: "Skills Offered (Teach)",
      value: teachCount,
      icon: GraduationCap,
      color: "bg-emerald-500",
      textColor: "text-emerald-700",
      bgColor: "bg-emerald-50",
    },
    {
      label: "Skills Desired (Learn)",
      value: learnCount,
      icon: BookOpen,
      color: "bg-blue-500",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50",
    },
    {
      label: "Matching Partners",
      value: matchesCount,
      icon: Users,
      color: "bg-purple-500",
      textColor: "text-purple-700",
      bgColor: "bg-purple-50",
    },
    {
      label: "Pending Requests",
      value: pendingExchangesCount,
      icon: RefreshCw,
      color: "bg-amber-500",
      textColor: "text-amber-700",
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {stat.value}
              </p>
            </div>
            <div className={`p-3 rounded-xl ${stat.bgColor} ${stat.textColor}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
