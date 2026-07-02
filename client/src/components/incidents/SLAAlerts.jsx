import React from "react";
import { ShieldAlert, AlertTriangle, ArrowRight } from "lucide-react";

export default function SLAAlerts({ incidents }) {
  const openIncidents = incidents.filter(
    (i) => i.status === "Open" || i.status === "In Progress",
  );

  const breaches = openIncidents.filter((i) => {
    const elapsed = (new Date() - new Date(i.created_at)) / 60000;
    const limit =
      i.priority === "High" ? 60 : i.priority === "Medium" ? 120 : 240;
    return elapsed > limit;
  });

  if (breaches.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-red-800 font-bold text-sm uppercase tracking-wider">
        <ShieldAlert className="h-5 w-5 text-red-600 animate-pulse" />
        <span>Critical SLA Breaches ({breaches.length})</span>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {breaches.map((incident) => {
          const elapsed = Math.round(
            (new Date() - new Date(incident.created_at)) / 60000,
          );
          const limit =
            incident.priority === "High"
              ? 60
              : incident.priority === "Medium"
                ? 120
                : 240;
          return (
            <div
              key={incident.id}
              className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start justify-between gap-4 shadow-sm"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-red-600 text-white uppercase">
                    {incident.priority} Priority
                  </span>
                  <h4 className="font-bold text-red-900 text-sm">
                    {incident.title}
                  </h4>
                </div>
                <p className="text-xs text-red-700">
                  Affected System:{" "}
                  <strong className="font-semibold">
                    {incident.affected_system}
                  </strong>{" "}
                  &bull; Elapsed:{" "}
                  <strong className="font-semibold">{elapsed} mins</strong> (SLA
                  Limit: {limit} mins)
                </p>
                <p className="text-xs text-red-600 italic font-mono">
                  Escalation Path: Auto-escalated to Tier 2 Support & IT Manager
                  notified.
                </p>
              </div>
              <div className="flex items-center gap-1 text-xs font-bold text-red-800 bg-red-100 px-2.5 py-1.5 rounded-lg border border-red-200 shrink-0">
                <span>Tier 2 Escalated</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
