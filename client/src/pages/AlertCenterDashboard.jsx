import React from "react";
import KPIGrid from "../components/alerts/KPIGrid.jsx";
import ActiveAlertBanner from "../components/alerts/ActiveAlertBanner.jsx";
import AlertHistoryTable from "../components/alerts/AlertHistoryTable.jsx";

export default function AlertCenterDashboard({
  notifications = [],
  activeAlert,
  onApprove,
  onBlock,
  isProcessing,
  onSelectAlert,
}) {
  const activeAlertCount = notifications.filter(
    (n) => n.status === "PENDING",
  ).length;

  // Calculate total secured amount (sum of approved/blocked transactions)
  const totalSecured = notifications
    .filter((n) => n.status !== "PENDING")
    .reduce((sum, n) => sum + Number(n.amount), 0);

  const formattedSecuredAmount =
    totalSecured > 0
      ? `$${totalSecured.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : "$42,500.00";

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl md:text-4xl font-bold text-on-surface">
          Alert Center
        </h2>
        <p className="text-lg text-on-surface-variant">
          Monitor and manage your active security notifications.
        </p>
      </div>

      {/* KPI Row */}
      <KPIGrid
        activeAlertCount={activeAlertCount}
        totalSecuredAmount={formattedSecuredAmount}
      />

      {/* Active Alert Banner */}
      <ActiveAlertBanner
        alert={activeAlert}
        onApprove={onApprove}
        onBlock={onBlock}
        isProcessing={isProcessing}
      />

      {/* Alert History Table */}
      <AlertHistoryTable
        notifications={notifications}
        onSelectAlert={onSelectAlert}
      />
    </div>
  );
}
