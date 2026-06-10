import React, { useState } from 'react';

export default function DeceasedInventoryTable({ bodies = [], onUpdateStatus, onRegisterClick }) {
  const [statusFilter, setStatusFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');

  const filteredBodies = bodies.filter((body) => {
    const matchesStatus = statusFilter ? body.status?.toLowerCase() === statusFilter.toLowerCase() : true;
    const matchesLocation = locationFilter ? body.location?.toLowerCase().includes(locationFilter.toLowerCase()) : true;
    return matchesStatus && matchesLocation;
  });

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'intake':
        return 'bg-tertiary-container/20 text-tertiary border border-tertiary/30';
      case 'refrigeration':
        return 'bg-blue-500/20 text-blue-400 border border-blue-500/30';
      case 'preparation':
      case 'in prep':
        return 'bg-primary-container/20 text-primary border border-primary/30';
      case 'released':
        return 'bg-outline-variant/20 text-on-surface-variant border border-outline-variant/30';
      default:
        return 'bg-secondary-container/20 text-secondary border border-secondary/30';
    }
  };

  return (
    <div className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden">
      <div className="px-6 py-5 border-b border-outline-variant flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-headline-md text-headline-md">Deceased Inventory</h3>
          <p className="text-on-surface-variant text-sm mt-1">Track and manage all deceased individuals within the facility.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-1.5 text-sm text-on-surface outline-none focus:border-primary"
          >
            <option value="">All Statuses</option>
            <option value="intake">Intake</option>
            <option value="refrigeration">Refrigeration</option>
            <option value="preparation">Preparation</option>
            <option value="released">Released</option>
          </select>
          <input
            type="text"
            placeholder="Filter by location..."
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-1.5 text-sm text-on-surface outline-none focus:border-primary"
          />
          <button
            onClick={onRegisterClick}
            className="bg-primary-container text-on-primary-container px-4 py-1.5 rounded-lg text-sm font-medium hover:opacity-90 transition-all"
          >
            New Intake
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low">
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Tracking ID</th>
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Deceased Name</th>
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Intake Date</th>
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Location</th>
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Status</th>
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {filteredBodies.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-on-surface-variant">
                  No records match the filters.
                </td>
              </tr>
            ) : (
              filteredBodies.map((body, index) => (
                <tr
                  key={body.body_id || index}
                  className={`hover:bg-surface-container-high transition-colors ${
                    index % 2 === 1 ? 'bg-surface-container-low/30' : ''
                  }`}
                >
                  <td className="px-6 py-5 font-mono text-xs text-on-surface-variant">
                    #{body.body_id ? body.body_id.substring(0, 8).toUpperCase() : `BT-2026-00${index + 1}`}
                  </td>
                  <td className="px-6 py-5 font-medium">
                    {body.first_name || body.last_name
                      ? `${body.first_name || ''} ${body.last_name || ''}`.trim()
                      : 'Unknown'}
                  </td>
                  <td className="px-6 py-5 text-on-surface-variant">
                    {body.intake_date ? body.intake_date.substring(0, 10) : 'N/A'}
                  </td>
                  <td className="px-6 py-5">
                    <span>{body.location || 'N/A'}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeClass(body.status)}`}>
                      {body.status || 'Intake'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button
                      onClick={() => onUpdateStatus(body)}
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