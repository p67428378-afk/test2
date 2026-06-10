import React from 'react';

export default function StatsGrid({ stats }) {
  const {
    activeCases = 14,
    occupancyRate = 45,
    occupancyText = '18/40 refrigeration slots',
    upcomingServices = 6,
    outstandingInvoices = 12450,
    pendingInvoicesCount = 4,
  } = stats || {};

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-gutter mb-10">
      {/* Active Cases */}
      <div className="bg-surface-container p-6 rounded-xl border border-outline-variant relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <span className="material-symbols-outlined text-5xl text-primary">groups</span>
        </div>
        <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Active Cases</span>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-4xl font-headline-xl text-primary">{activeCases}</span>
          <span className="text-primary text-label-md font-bold">+2 this week</span>
        </div>
        <div className="mt-4 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
          <div className="h-full bg-primary" style={{ width: '65%' }}></div>
        </div>
      </div>

      {/* Occupancy Rate */}
      <div className="bg-surface-container p-6 rounded-xl border border-outline-variant relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <span className="material-symbols-outlined text-5xl text-tertiary">ac_unit</span>
        </div>
        <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Occupancy Rate</span>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-4xl font-headline-xl text-tertiary">{occupancyRate}%</span>
          <span className="text-on-surface-variant text-label-md">{occupancyText}</span>
        </div>
        <div className="mt-4 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
          <div className="h-full bg-tertiary" style={{ width: `${occupancyRate}%` }}></div>
        </div>
      </div>

      {/* Upcoming Services */}
      <div className="bg-surface-container p-6 rounded-xl border border-outline-variant relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <span className="material-symbols-outlined text-5xl text-secondary">church</span>
        </div>
        <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Upcoming Services</span>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-4xl font-headline-xl text-secondary">{upcomingServices}</span>
          <span className="text-tertiary text-label-md font-bold">Scheduled today</span>
        </div>
        <div className="mt-4 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
          <div className="h-full bg-secondary" style={{ width: '80%' }}></div>
        </div>
      </div>

      {/* Outstanding Invoices */}
      <div className="bg-surface-container p-6 rounded-xl border border-outline-variant relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <span className="material-symbols-outlined text-5xl text-error">payments</span>
        </div>
        <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Outstanding Invoices</span>
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-4xl font-headline-xl text-error">
            ${outstandingInvoices.toLocaleString()}
          </span>
          <span className="text-error text-label-md font-bold">{pendingInvoicesCount} pending</span>
        </div>
        <div className="mt-4 h-1 w-full bg-surface-container-highest rounded-full overflow-hidden">
          <div className="h-full bg-error" style={{ width: '30%' }}></div>
        </div>
      </div>
    </section>
  );
}