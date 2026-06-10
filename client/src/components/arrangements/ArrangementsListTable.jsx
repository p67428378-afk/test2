import React, { useState } from 'react';

export default function ArrangementsListTable({ funerals = [], onCreateClick, onUpdateStatus }) {
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setServiceTypeFilter] = useState('');

  const filteredFunerals = funerals.filter((funeral) => {
    const matchesStatus = statusFilter ? funeral.status?.toLowerCase() === statusFilter.toLowerCase() : true;
    const matchesType = typeFilter ? funeral.service_type?.toLowerCase() === typeFilter.toLowerCase() : true;
    return matchesStatus && matchesType;
  });

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'bg-tertiary-container/20 text-tertiary border border-tertiary/30';
      case 'scheduled':
        return 'bg-primary-container/20 text-primary border border-primary/30';
      case 'cancelled':
        return 'bg-error-container/20 text-error border border-error/30';
      default:
        return 'bg-secondary-container/20 text-secondary border border-secondary/30';
    }
  };

  return (
    <div className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden">
      <div className="px-6 py-5 border-b border-outline-variant flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-headline-md text-headline-md">Funeral Arrangements</h3>
          <p className="text-on-surface-variant text-sm mt-1">Schedule and manage funeral services and arrangements.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-1.5 text-sm text-on-surface outline-none focus:border-primary"
          >
            <option value="">All Statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setServiceTypeFilter(e.target.value)}
            className="bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-1.5 text-sm text-on-surface outline-none focus:border-primary"
          >
            <option value="">All Types</option>
            <option value="burial">Burial</option>
            <option value="cremation">Cremation</option>
          </select>
          <button
            onClick={onCreateClick}
            className="bg-primary-container text-on-primary-container px-4 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition-all"
          >
            Schedule Service
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low">
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Funeral ID</th>
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Deceased ID</th>
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Service Type</th>
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Service Date</th>
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Assigned Resources</th>
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Status</th>
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {filteredFunerals.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-10 text-center text-on-surface-variant">
                  No arrangements found.
                </td>
              </tr>
            ) : (
              filteredFunerals.map((funeral, index) => (
                <tr
                  key={funeral.funeral_id || index}
                  className={`hover:bg-surface-container-high transition-colors ${
                    index % 2 === 1 ? 'bg-surface-container-low/30' : ''
                  }`}
                >
                  <td className="px-6 py-5 font-mono text-xs text-on-surface-variant">
                    #{funeral.funeral_id ? funeral.funeral_id.substring(0, 8).toUpperCase() : `FN-2026-00${index + 1}`}
                  </td>
                  <td className="px-6 py-5 font-mono text-xs text-on-surface-variant">
                    #{funeral.body_id ? funeral.body_id.substring(0, 8).toUpperCase() : 'N/A'}
                  </td>
                  <td className="px-6 py-5 font-medium capitalize">
                    {funeral.service_type || 'N/A'}
                  </td>
                  <td className="px-6 py-5 text-on-surface-variant">
                    {funeral.service_date ? new Date(funeral.service_date).toLocaleString() : 'N/A'}
                  </td>
                  <td className="px-6 py-5">
                    <span>{funeral.assigned_resources || 'None'}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeClass(funeral.status)}`}>
                      {funeral.status || 'Scheduled'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button
                      onClick={() => onUpdateStatus(funeral)}
                      className="text-primary hover:text-primary-fixed text-sm font-medium bg-transparent border-none cursor-pointer"
                    >
                      Update Status
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}