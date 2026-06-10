import React from 'react';

export default function FacilityOccupancyCard({ occupancy = 45, totalSlots = 40 }) {
  const occupiedSlots = Math.round((occupancy / 100) * totalSlots);

  return (
    <div className="bg-surface-container p-6 rounded-xl border border-outline-variant">
      <h3 className="font-headline-md text-headline-md mb-4">Facility Occupancy</h3>
      <div className="flex items-center justify-between mb-2">
        <span className="text-on-surface-variant text-sm">Refrigeration Slots</span>
        <span className="text-tertiary font-bold text-sm">{occupiedSlots} / {totalSlots} Occupied</span>
      </div>
      <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden mb-6">
        <div className="h-full bg-tertiary transition-all duration-500" style={{ width: `${occupancy}%` }}></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant">
          <span className="text-xs text-on-surface-variant uppercase tracking-wider">Prep Room 1</span>
          <p className="text-lg font-bold mt-1 text-primary">Active</p>
        </div>
        <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant">
          <span className="text-xs text-on-surface-variant uppercase tracking-wider">Chapel A</span>
          <p className="text-lg font-bold mt-1 text-secondary">Scheduled</p>
        </div>
      </div>
    </div>
  );
}