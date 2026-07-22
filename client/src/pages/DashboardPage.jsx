import React, { useEffect, useState } from "react";
import KPIGrid from "../components/equipment/KPIGrid.jsx";
import {
  componentService,
  missionService,
  inspectionService,
  alertService,
} from "../services/api";
import { AlertTriangle, Calendar, CheckCircle2, RefreshCw } from "lucide-react";

export default function DashboardPage() {
  const [components, setComponents] = useState([]);
  const [missions, setMissions] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [triggeringAlerts, setTriggeringAlerts] = useState(false);
  const [alertResult, setAlertResult] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [compData, missionData, inspData] = await Promise.all([
        componentService.list(),
        missionService.list(),
        inspectionService.list(),
      ]);
      setComponents(compData);
      setMissions(missionData);
      setInspections(inspData);
    } catch (err) {
      // Silent catch or handle error state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTriggerAlerts = async () => {
    setTriggeringAlerts(true);
    setAlertResult(null);
    try {
      const res = await alertService.trigger();
      setAlertResult(`Alerts triggered successfully! Sent: ${res.alerts_sent}`);
      fetchData();
    } catch (err) {
      setAlertResult("Failed to trigger alerts.");
    } finally {
      setTriggeringAlerts(false);
    }
  };

  // Calculate metrics
  const totalComponents = components.length;
  const lowInventoryCount = components.filter(
    (c) => c.inventory_count < 5,
  ).length;
  const activeMissions = missions.filter(
    (m) => m.status === "Active" || m.status === "In Progress",
  ).length;

  // Mock expired certifications count or calculate if we have details
  // Let's assume components with status 'Out of Service' or specific flags might have expired certs
  const expiredCertifications = components.filter(
    (c) => c.status === "Out of Service",
  ).length;

  // Calculate readiness percentages
  const readyCount = components.filter((c) => c.status === "Available").length;
  const maintCount = components.filter(
    (c) => c.status === "Maintenance",
  ).length;
  const outCount = components.filter(
    (c) => c.status === "Out of Service",
  ).length;

  const readyPercent =
    totalComponents > 0
      ? Math.round((readyCount / totalComponents) * 100)
      : 100;
  const maintPercent =
    totalComponents > 0 ? Math.round((maintCount / totalComponents) * 100) : 0;
  const outPercent =
    totalComponents > 0 ? Math.round((outCount / totalComponents) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-[#dee4e1]">
            Systems Overview
          </h2>
          <p className="text-sm text-[#bcc9c6] mt-1">
            Real-time telemetry and equipment status.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleTriggerAlerts}
            disabled={triggeringAlerts}
            className="bg-[#1b2120] border border-[#3d4947] text-[#dee4e1] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#303635] transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${triggeringAlerts ? "animate-spin" : ""}`}
            />
            Trigger Alerts Check
          </button>
        </div>
      </div>

      {alertResult && (
        <div className="p-4 bg-[#6bd8cb]/10 border border-[#6bd8cb]/20 text-[#6bd8cb] rounded-lg text-sm">
          {alertResult}
        </div>
      )}

      <KPIGrid
        totalComponents={totalComponents}
        lowInventoryCount={lowInventoryCount}
        expiredCertifications={expiredCertifications}
        activeMissions={activeMissions}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: Alerts */}
        <div className="lg:col-span-8 bg-[#1b2120] border border-[#3d4947] rounded-lg flex flex-col h-[400px]">
          <div className="p-5 border-b border-[#3d4947] flex justify-between items-center bg-[#1b2120]/50 rounded-t-lg">
            <h3 className="text-lg font-semibold text-[#dee4e1]">
              Active Alerts &amp; Maintenance Deadlines
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {components.filter(
              (c) =>
                c.status === "Maintenance" ||
                c.status === "Out of Service" ||
                c.flagged_for_review,
            ).length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-[#bcc9c6]">
                <CheckCircle2 className="w-12 h-12 text-[#6bd8cb] mb-2" />
                <p>All systems nominal. No active alerts.</p>
              </div>
            ) : (
              components
                .filter(
                  (c) =>
                    c.status === "Maintenance" ||
                    c.status === "Out of Service" ||
                    c.flagged_for_review,
                )
                .map((comp) => (
                  <div
                    key={comp.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-[#171d1c] border border-[#3d4947] hover:border-[#6bd8cb] transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`mt-1 w-2.5 h-2.5 rounded-full ${
                          comp.status === "Out of Service"
                            ? "bg-[#ffb4ab]"
                            : "bg-[#d27956]"
                        }`}
                      ></div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-semibold text-[#dee4e1]">
                            {comp.name}
                          </span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded border ${
                              comp.status === "Out of Service"
                                ? "bg-[#ffb4ab]/10 text-[#ffb4ab] border-[#ffb4ab]/20"
                                : "bg-[#d27956]/10 text-[#d27956] border-[#d27956]/20"
                            }`}
                          >
                            {comp.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#bcc9c6]">
                          Location: {comp.location}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Right Panel: Donut Chart */}
        <div className="lg:col-span-4 bg-[#1b2120] border border-[#3d4947] rounded-lg p-5 flex flex-col h-[400px]">
          <h3 className="text-lg font-semibold text-[#dee4e1] mb-6">
            Mission Readiness
          </h3>
          <div className="flex-1 flex flex-col items-center justify-center relative">
            <svg
              className="transform -rotate-90"
              height="160"
              viewBox="0 0 42 42"
              width="160"
            >
              <circle
                cx="21"
                cy="21"
                fill="transparent"
                r="15.915"
                stroke="#171d1c"
                strokeWidth="6"
              ></circle>
              <circle
                className="transition-all duration-1000 ease-out"
                cx="21"
                cy="21"
                fill="transparent"
                r="15.915"
                stroke="#6bd8cb"
                strokeWidth="6"
                strokeDasharray={`${readyPercent} ${100 - readyPercent}`}
                strokeDashoffset="25"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-bold text-[#dee4e1]">
                {readyPercent}%
              </span>
              <span className="text-xs text-[#6bd8cb] uppercase tracking-widest mt-1 font-mono">
                Ready
              </span>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#6bd8cb]"></span>
                <span className="text-[#bcc9c6]">Ready for Flight</span>
              </div>
              <span className="text-[#dee4e1] font-mono">{readyPercent}%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#d27956]"></span>
                <span className="text-[#bcc9c6]">Maintenance</span>
              </div>
              <span className="text-[#dee4e1] font-mono">{maintPercent}%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-[#ffb4ab]"></span>
                <span className="text-[#bcc9c6]">Out of Service</span>
              </div>
              <span className="text-[#dee4e1] font-mono">{outPercent}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Inspections */}
      <div className="bg-[#1b2120] border border-[#3d4947] rounded-lg overflow-hidden">
        <div className="p-5 border-b border-[#3d4947] bg-[#1b2120]/50">
          <h3 className="text-lg font-semibold text-[#dee4e1]">
            Upcoming Inspections &amp; Calibrations
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#0a0f0e]/50 border-b border-[#3d4947]">
                <th className="p-4 text-xs font-semibold text-[#bcc9c6] uppercase tracking-wider font-mono">
                  Event Type
                </th>
                <th className="p-4 text-xs font-semibold text-[#bcc9c6] uppercase tracking-wider font-mono">
                  Scheduled Date
                </th>
                <th className="p-4 text-xs font-semibold text-[#bcc9c6] uppercase tracking-wider font-mono">
                  Completion Date
                </th>
                <th className="p-4 text-xs font-semibold text-[#bcc9c6] uppercase tracking-wider font-mono">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-[#3d4947]/50">
              {inspections.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-[#bcc9c6]">
                    No upcoming inspections scheduled.
                  </td>
                </tr>
              ) : (
                inspections.map((insp) => (
                  <tr
                    key={insp.id}
                    className="hover:bg-[#303635] transition-colors"
                  >
                    <td className="p-4 text-[#dee4e1] font-semibold">
                      {insp.event_type}
                    </td>
                    <td className="p-4 text-[#bcc9c6] font-mono">
                      {insp.scheduled_date}
                    </td>
                    <td className="p-4 text-[#bcc9c6] font-mono">
                      {insp.completion_date || "Pending"}
                    </td>
                    <td className="p-4 text-[#bcc9c6]">
                      {insp.notes || "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
