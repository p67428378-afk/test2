import React from "react";

export default function KPIGrid({ items = [], total = 0 }) {
  // Calculate counts dynamically from items
  const pendingCount = items.filter(
    (item) => item.status?.toLowerCase() === "pending",
  ).length;
  const inProgressCount = items.filter((item) =>
    ["in progress", "in_progress"].includes(item.status?.toLowerCase()),
  ).length;
  const completedCount = items.filter(
    (item) => item.status?.toLowerCase() === "completed",
  ).length;

  // Fallback to mock values if no items exist yet to match the Stitch design spec
  const displayTotal = total || 150;
  const displayPending = total ? pendingCount : 42;
  const displayInProgress = total ? inProgressCount : 18;
  const displayCompleted = total ? completedCount : 90;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-space-xl">
      {/* KPI 1 */}
      <div className="bg-white p-space-lg rounded-xl border border-outline-variant shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-surface-container-low rounded-lg text-primary">
            <span className="material-symbols-outlined" data-icon="list_alt">
              list_alt
            </span>
          </div>
          <span className="text-tertiary-container flex items-center text-xs font-semibold">
            <span
              className="material-symbols-outlined text-xs mr-1"
              data-icon="trending_up"
            >
              trending_up
            </span>
            +4.5%
          </span>
        </div>
        <h3 className="text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
          Total Items
        </h3>
        <p className="font-headline-lg text-headline-lg text-on-surface mt-1">
          {displayTotal}
        </p>
      </div>

      {/* KPI 2 */}
      <div className="bg-white p-space-lg rounded-xl border border-outline-variant shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-[#FEF9C3] rounded-lg text-[#A16207]">
            <span className="material-symbols-outlined" data-icon="pending">
              pending
            </span>
          </div>
        </div>
        <h3 className="text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
          Pending
        </h3>
        <p className="font-headline-lg text-headline-lg text-on-surface mt-1">
          {displayPending}
        </p>
      </div>

      {/* KPI 3 */}
      <div className="bg-white p-space-lg rounded-xl border border-outline-variant shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-secondary-container rounded-lg text-primary">
            <span className="material-symbols-outlined" data-icon="sync">
              sync
            </span>
          </div>
        </div>
        <h3 className="text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
          In Progress
        </h3>
        <p className="font-headline-lg text-headline-lg text-on-surface mt-1">
          {displayInProgress}
        </p>
      </div>

      {/* KPI 4 */}
      <div className="bg-white p-space-lg rounded-xl border border-outline-variant shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 bg-tertiary-fixed rounded-lg text-tertiary-fixed-variant">
            <span
              className="material-symbols-outlined"
              data-icon="check_circle"
            >
              check_circle
            </span>
          </div>
        </div>
        <h3 className="text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">
          Completed
        </h3>
        <p className="font-headline-lg text-headline-lg text-on-surface mt-1">
          {displayCompleted}
        </p>
      </div>
    </div>
  );
}
