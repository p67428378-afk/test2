import React from "react";
import { Users, Percent, AlertTriangle, ShieldAlert } from "lucide-react";

export default function KPIGrid({
  totalStudents,
  attendanceRate,
  absentToday,
  unexcused,
}) {
  const kpis = [
    {
      title: "Total Students",
      value: totalStudents,
      icon: Users,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      title: "Attendance Rate",
      value: `${attendanceRate}%`,
      icon: Percent,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      title: "Absent Today",
      value: absentToday,
      icon: AlertTriangle,
      color: "text-rose-600 bg-rose-50 border-rose-100",
    },
    {
      title: "Unexcused Absences",
      value: unexcused,
      icon: ShieldAlert,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.title}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium text-slate-500">{kpi.title}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {kpi.value}
              </p>
            </div>
            <div className={`p-3 rounded-lg border ${kpi.color}`}>
              <Icon className="h-6 w-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
