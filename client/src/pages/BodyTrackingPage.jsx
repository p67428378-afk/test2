import React from 'react';
import DeceasedInventoryTable from '../components/tracking/DeceasedInventoryTable';
import FacilityOccupancyCard from '../components/tracking/FacilityOccupancyCard';

export default function BodyTrackingPage({ bodies, onUpdateStatus, onRegisterClick, stats }) {
  return (
    <div>
      <div className="mb-10">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">Body Tracking &amp; Inventory</h2>
        <p className="text-on-surface-variant font-body-md">Monitor and update the status and location of deceased individuals within the facility.</p>
      </div>

      <div className="grid grid-cols-12 gap-gutter">
        <div className="col-span-12 xl:col-span-8">
          <DeceasedInventoryTable
            bodies={bodies}
            onUpdateStatus={onUpdateStatus}
            onRegisterClick={onRegisterClick}
          />
        </div>
        <div className="col-span-12 xl:col-span-4">
          <FacilityOccupancyCard
            occupancy={stats?.occupancyRate}
            totalSlots={40}
          />
        </div>
      </div>
    </div>
  );
}