import React from 'react';

export default function SpecialRequestsCard() {
  const requests = [
    { case: 'Eleanor Vance', request: 'Live stream service for overseas relatives.', status: 'Pending' },
    { case: 'Thomas Miller', request: 'Eco-friendly biodegradable urn requested.', status: 'Approved' },
    { case: 'Sarah Jenkins', request: 'Special floral arrangement (white lilies and roses).', status: 'Approved' },
  ];

  return (
    <div className="bg-surface-container p-6 rounded-xl border border-outline-variant">
      <h3 className="font-headline-md text-headline-md mb-4">Special Requests</h3>
      <div className="space-y-4">
        {requests.map((req, index) => (
          <div key={index} className="p-4 bg-surface-container-low rounded-lg border border-outline-variant">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-primary uppercase">{req.case}</span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                req.status === 'Approved' ? 'bg-tertiary-container/20 text-tertiary' : 'bg-secondary-container/20 text-secondary'
              }`}>
                {req.status}
              </span>
            </div>
            <p className="text-sm text-on-surface-variant">{req.request}</p>
          </div>
        ))}
      </div>
    </div>
  );
}