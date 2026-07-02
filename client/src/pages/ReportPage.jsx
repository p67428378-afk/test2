import React from "react";
import IncidentForm from "../components/incidents/IncidentForm";

export default function ReportPage({ onIncidentCreated }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Report System Outage
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Submit a new incident report to notify engineers and trigger SLA
          tracking.
        </p>
      </div>
      <IncidentForm onIncidentCreated={onIncidentCreated} />
    </div>
  );
}
