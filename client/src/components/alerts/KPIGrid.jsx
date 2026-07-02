import React from "react";
import Card from "../common/Card.jsx";

export default function KPIGrid({
  activeAlertCount = 0,
  totalSecuredAmount = "$42,500",
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Active Alerts KPI */}
      <Card alert={activeAlertCount > 0}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#EF4444]/10 to-transparent opacity-50"></div>
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Active Alerts
            </span>
            <div className="w-10 h-10 rounded-lg bg-[#EF4444]/10 flex items-center justify-center border border-[#EF4444]/20">
              <span className="material-symbols-outlined text-[#EF4444] animate-pulse">
                warning
              </span>
            </div>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-on-surface">
              {activeAlertCount}
            </span>
            <span className="text-sm text-[#EF4444] font-medium pb-1 flex items-center gap-1">
              {activeAlertCount > 0 ? "Pending Action" : "All Secured"}
            </span>
          </div>
        </div>
      </Card>

      {/* Monitored Cards KPI */}
      <Card>
        <div className="absolute inset-0 bg-gradient-to-br from-[#1E293B] to-transparent opacity-50"></div>
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Monitored Cards
            </span>
            <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center border border-outline-variant">
              <span className="material-symbols-outlined text-on-surface">
                credit_score
              </span>
            </div>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-on-surface">2</span>
            <span className="text-xs text-secondary bg-secondary/10 px-2 py-0.5 rounded-full border border-secondary/20 pb-1 flex items-center">
              Active Debit Cards
            </span>
          </div>
        </div>
      </Card>

      {/* Secured Transactions KPI */}
      <Card>
        <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/10 to-transparent opacity-50"></div>
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
              Secured Transactions (30d)
            </span>
            <div className="w-10 h-10 rounded-lg bg-surface-container-highest flex items-center justify-center border border-outline-variant">
              <span className="material-symbols-outlined text-primary">
                shield
              </span>
            </div>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-on-surface">
              {totalSecuredAmount}
            </span>
            <span className="text-sm text-secondary font-medium pb-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">
                arrow_upward
              </span>{" "}
              8.2%
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
