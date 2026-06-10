import React from 'react';
import StatsGrid from '../components/dashboard/StatsGrid';
import RecentIntakesTable from '../components/dashboard/RecentIntakesTable';
import TodaysScheduleList from '../components/dashboard/TodaysScheduleList';

export default function DashboardPage({ stats, bodies, funerals, onViewAllBodies, onViewFullCalendar }) {
  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">Morning, Director Pendelton</h2>
          <p className="text-on-surface-variant font-body-md">Here is an overview of the current facility status for May 16, 2026.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-label-md flex items-center gap-2 hover:bg-surface-container-high transition-colors text-on-surface">
            <span className="material-symbols-outlined text-sm">filter_list</span> Filter
          </button>
          <button className="px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-label-md flex items-center gap-2 hover:bg-surface-container-high transition-colors text-on-surface">
            <span className="material-symbols-outlined text-sm">download</span> Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <StatsGrid stats={stats} />

      {/* Two-Column Row */}
      <div className="grid grid-cols-12 gap-gutter">
        {/* Left: Recent Intakes & Status (8/12) */}
        <div className="col-span-12 xl:col-span-8">
          <RecentIntakesTable bodies={bodies} onViewAll={onViewAllBodies} />
        </div>
        {/* Right: Today's Schedule (4/12) */}
        <div className="col-span-12 xl:col-span-4">
          <TodaysScheduleList funerals={funerals} onViewFullCalendar={onViewFullCalendar} />
        </div>
      </div>
    </div>
  );
}