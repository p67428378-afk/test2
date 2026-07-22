import React from "react";
import { Cpu, AlertTriangle, ShieldAlert, Rocket } from "lucide-react";

export default function KPIGrid({
  totalComponents = 0,
  lowInventoryCount = 0,
  expiredCertifications = 0,
  activeMissions = 0,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* KPI 1 */}
      <div className="bg-[#1b2120] border border-[#3d4947] rounded-lg p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
          <Cpu className="w-10 h-10 text-[#6bd8cb]" />
        </div>
        <p className="text-xs text-[#bcc9c6] uppercase tracking-wider mb-2 font-mono">
          Total Components
        </p>
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-[#dee4e1]">
            {totalComponents}
          </span>
          <span className="text-xs text-[#6bd8cb] bg-[#6bd8cb]/10 px-2 py-0.5 rounded-full font-mono">
            Active
          </span>
        </div>
      </div>

      {/* KPI 2 */}
      <div className="bg-[#1b2120] border border-[#3d4947] rounded-lg p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
          <AlertTriangle className="w-10 h-10 text-[#d27956]" />
        </div>
        <p className="text-xs text-[#bcc9c6] uppercase tracking-wider mb-2 font-mono">
          Low Inventory Alerts
        </p>
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-[#dee4e1]">
            {lowInventoryCount}
          </span>
          {lowInventoryCount > 0 && (
            <span className="text-xs text-[#d27956] bg-[#d27956]/10 px-2 py-0.5 rounded-full font-mono">
              Action required
            </span>
          )}
        </div>
      </div>

      {/* KPI 3 */}
      <div className="bg-[#1b2120] border border-[#ffb4ab]/30 rounded-lg p-5 relative overflow-hidden group shadow-[0_0_15px_rgba(255,180,171,0.05)]">
        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
          <ShieldAlert className="w-10 h-10 text-[#ffb4ab]" />
        </div>
        <p className="text-xs text-[#ffb4ab] uppercase tracking-wider mb-2 font-mono">
          Expired Certifications
        </p>
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-[#ffb4ab]">
            {expiredCertifications}
          </span>
          {expiredCertifications > 0 && (
            <span className="text-xs text-[#ffb4ab] bg-[#ffb4ab]/10 px-2 py-0.5 rounded-full border border-[#ffb4ab]/20 font-mono">
              Critical
            </span>
          )}
        </div>
      </div>

      {/* KPI 4 */}
      <div className="bg-[#1b2120] border border-[#3d4947] rounded-lg p-5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
          <Rocket className="w-10 h-10 text-[#7bd0ff]" />
        </div>
        <p className="text-xs text-[#bcc9c6] uppercase tracking-wider mb-2 font-mono">
          Active Missions
        </p>
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-[#dee4e1]">
            {activeMissions}
          </span>
          <span className="text-xs text-[#7bd0ff] bg-[#7bd0ff]/10 px-2 py-0.5 rounded-full font-mono">
            In progress
          </span>
        </div>
      </div>
    </div>
  );
}
