import React from "react";
import { Bell, ShieldAlert, CheckCircle, Clock } from "lucide-react";

export default function Header({ incidents = [] }) {
  const openIncidents = incidents.filter(
    (i) => i.status === "Open" || i.status === "In Progress",
  );
  const highPriorityBreaches = openIncidents.filter((i) => {
    if (i.priority !== "High") return false;
    const elapsed = (new Date() - new Date(i.created_at)) / 60000;
    return elapsed > 60; // 1 hour SLA
  });

  return (
    <header className="bg-white border-b border-slate-200 h-16 px-8 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-bold text-slate-800">
          BFSI IT Command Center
        </h2>
        {highPriorityBreaches.length > 0 && (
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200 animate-bounce">
            <ShieldAlert className="h-3.5 w-3.5" />
            {highPriorityBreaches.length} SLA Breach Escalation(s) Active
          </span>
        )}
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg">
          <Clock className="h-4 w-4 text-slate-500" />
          <span className="font-medium">System Status:</span>
          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
            <CheckCircle className="h-3.5 w-3.5" /> Operational
          </span>
        </div>
        <div className="relative cursor-pointer p-1.5 hover:bg-slate-100 rounded-full transition-colors">
          <Bell className="h-5 w-5 text-slate-600" />
          {openIncidents.length > 0 && (
            <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
              {openIncidents.length}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
