import React from 'react';
import { FileText, AlertCircle, Compass, Calendar, TrendingUp } from 'lucide-react';

function StatCardsGrid({ bookingsCount = 48, pendingCount = 3, activeCount = 5, slotsCount = 12 }) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop">
      {/* Stat Card 1 */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-[16px] p-6 relative overflow-hidden group hover:border-primary-container transition-colors">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center border border-outline-variant text-primary">
            <FileText className="w-5 h-5" />
          </div>
          <span className="bg-primary-container/10 text-primary-container px-2 py-1 rounded-full font-caption text-caption flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +8%
          </span>
        </div>
        <div>
          <h3 className="font-body-md text-body-md text-on-surface-variant mb-1">Total Bookings</h3>
          <p className="font-display-lg text-display-lg text-on-surface">{bookingsCount}</p>
          <p className="font-caption text-caption text-on-surface-variant mt-2">This month</p>
        </div>
      </div>

      {/* Stat Card 2 */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-[16px] p-6 relative overflow-hidden group hover:border-error transition-colors">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center border border-outline-variant text-error">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>
        <div>
          <h3 className="font-body-md text-body-md text-on-surface-variant mb-1">Pending Requests</h3>
          <p className="font-display-lg text-display-lg text-on-surface">{pendingCount}</p>
          <p className="font-caption text-caption text-error mt-2 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> Action required
          </p>
        </div>
      </div>

      {/* Stat Card 3 */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-[16px] p-6 relative overflow-hidden group hover:border-secondary transition-colors">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center border border-outline-variant text-secondary">
            <Compass className="w-5 h-5" />
          </div>
        </div>
        <div>
          <h3 className="font-body-md text-body-md text-on-surface-variant mb-1">Active Treks</h3>
          <p className="font-display-lg text-display-lg text-on-surface">{activeCount}</p>
          <p className="font-caption text-caption text-on-surface-variant mt-2">Next: Annapurna Circuit</p>
        </div>
      </div>

      {/* Stat Card 4 */}
      <div className="bg-[#1E293B] border border-[#334155] rounded-[16px] p-6 relative overflow-hidden group hover:border-primary-container transition-colors">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center border border-outline-variant text-primary-container">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
        <div>
          <h3 className="font-body-md text-body-md text-on-surface-variant mb-1">Availability Slots</h3>
          <p className="font-display-lg text-display-lg text-on-surface">{slotsCount}</p>
          <p className="font-caption text-caption text-on-surface-variant mt-2">This week</p>
        </div>
      </div>
    </section>
  );
}

export default StatCardsGrid;
