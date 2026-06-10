import React from 'react';
import ArrangementsListTable from '../components/arrangements/ArrangementsListTable';
import ResourceAvailabilityCard from '../components/arrangements/ResourceAvailabilityCard';
import SpecialRequestsCard from '../components/arrangements/SpecialRequestsCard';

export default function FuneralArrangementsPage({ funerals, onCreateClick, onUpdateStatus }) {
  return (
    <div>
      <div className="mb-10">
        <h2 className="font-headline-lg text-headline-lg text-on-surface mb-1">Funeral Arrangements</h2>
        <p className="text-on-surface-variant font-body-md">Schedule, view, and manage funeral services and resource assignments.</p>
      </div>

      <div className="grid grid-cols-12 gap-gutter">
        <div className="col-span-12 xl:col-span-8">
          <ArrangementsListTable
            funerals={funerals}
            onCreateClick={onCreateClick}
            onUpdateStatus={onUpdateStatus}
          />
        </div>
        <div className="col-span-12 xl:col-span-4 space-y-6">
          <ResourceAvailabilityCard />
          <SpecialRequestsCard />
        </div>
      </div>
    </div>
  );
}