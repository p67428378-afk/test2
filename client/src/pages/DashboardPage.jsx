import React from "react";
import {
  ShieldAlert,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  Settings,
} from "lucide-react";
import KPICard from "../components/incidents/KPICard";
import SLAAlerts from "../components/incidents/SLAAlerts";
import IncidentTable from "../components/incidents/IncidentTable";

export default function DashboardPage({ incidents, users, onUpdateIncident }) {
  const openIncidents = incidents.filter(
    (i) => i.status === "Open" || i.status === "In Progress",
  );
  const resolvedIncidents = incidents.filter(
    (i) => i.status === "Resolved" || i.status === "Closed",
  );

  const highPriorityBreaches = openIncidents.filter((i) => {
    if (i.priority !== "High") return false;
    const elapsed = (new Date() - new Date(i.created_at)) / 60000;
    return elapsed > 60; // 1 hour SLA
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            IT Incident Dashboard
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Real-time monitoring of system outages, SLA compliance, and
            engineering response.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <KPICard
          title="Active Outages"
          value={openIncidents.length}
          icon={AlertTriangle}
          color="red"
          description="Requires immediate attention"
        />
        <KPICard
          title="SLA Breaches"
          value={highPriorityBreaches.length}
          icon={ShieldAlert}
          color="amber"
          description="High priority > 1 hour open"
        />
        <KPICard
          title="Resolved Incidents"
          value={resolvedIncidents.length}
          icon={CheckCircle}
          color="emerald"
          description="RCA reports generated"
        />
        <KPICard
          title="Total Tracked"
          value={incidents.length}
          icon={Clock}
          color="blue"
          description="All-time reported incidents"
        />
      </div>

      {/* SLA Alerts Section */}
      <SLAAlerts incidents={incidents} />

      {/* Incident Table */}
      <IncidentTable
        incidents={incidents}
        users={users}
        onUpdateIncident={onUpdateIncident}
      />
    </div>
  );
}
