import React from 'react';

export default function ResourceAvailabilityCard() {
  const resources = [
    { name: 'Chapel A', status: 'Occupied', time: '10:00 AM - 12:00 PM', color: 'text-primary' },
    { name: 'Chapel B', status: 'Available', time: 'All Day', color: 'text-tertiary' },
    { name: 'Crematory', status: 'Occupied', time: '2:00 PM - 4:00 PM', color: 'text-primary' },
    { name: 'Viewing Room 1', status: 'Available', time: 'All Day', color: 'text-tertiary' },
    { name: 'Viewing Room 2', status: 'Occupied', time: '4:30 PM - 6:30 PM', color: 'text-primary' },
  ];

  return (
    <div className="bg-surface-container p-6 rounded-xl border border-outline-variant">
      <h3 className="font-headline-md text-headline-md mb-4">Resource Availability</h3>
      <div className="space-y-4">
        {resources.map((res, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg border border-outline-variant">
            <div>
              <h4 className="font-medium text-on-surface">{res.name}</h4>
              <p className="text-xs text-on-surface-variant mt-0.5">{res.time}</p>
            </div>
            <span className={`text-xs font-bold uppercase tracking-wider ${res.color}`}>
              {res.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}