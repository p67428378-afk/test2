import React from 'react';

export default function RecentIntakesTable({ bodies = [], onViewAll }) {
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

  const getLocationDotClass = (location) => {
    const loc = location?.toLowerCase() || '';
    if (loc.includes('refrigeration')) return 'bg-blue-400';
    if (loc.includes('prep')) return 'bg-amber-400';
    if (loc.includes('chapel')) return 'bg-purple-400';
    return 'bg-gray-500';
  };

  return (
    <div className="bg-surface-container rounded-xl border border-outline-variant overflow-hidden">
      <div className="px-6 py-5 border-b border-outline-variant flex justify-between items-center">
        <h3 className="font-headline-md text-headline-md">Recent Intakes &amp; Status</h3>
        <button onClick={onViewAll} className="text-primary font-label-md hover:underline bg-transparent border-none cursor-pointer">
          View All Records
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low">
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Tracking ID</th>
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Deceased Name</th>
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Intake Date</th>
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Location</th>
              <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {bodies.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-on-surface-variant">
                  No recent intakes found.
                </td>
              </tr>
            ) : (
              bodies.slice(0, 5).map((body, index) => (
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
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${getLocationDotClass(body.location)}`}></span>
                      <span>{body.location || 'N/A'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusBadgeClass(body.status)}`}>
                      {body.status || 'Intake'}
                    </span>
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