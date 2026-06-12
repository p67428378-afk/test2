import React from 'react';
import Badge from '../common/Badge';

export default function AlertsTable({ alerts = [], onStatusFilterChange, currentFilter }) {
  const filters = [
    { label: 'All Alerts', value: '' },
    { label: 'Open', value: 'OPEN' },
    { label: 'Under Review', value: 'UNDER_REVIEW' },
    { label: 'Resolved (False Positive)', value: 'RESOLVED_FALSE_POSITIVE' },
    { label: 'Resolved (Suspicious)', value: 'RESOLVED_SUSPICIOUS' },
  ];

  return (
    <div className="bg-surface-container rounded-lg border border-outline-variant overflow-hidden flex flex-col">
      <div className="p-6 border-b border-outline-variant/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Transaction Alerts</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">High-density grid of system-triggered transaction monitoring alerts.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.label}
              onClick={() => onStatusFilterChange(f.value)}
              className={`px-3 py-1.5 rounded-md font-mono-data text-mono-data text-xs transition-colors ${
                currentFilter === f.value
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-surface-container-highest/50 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 border-b border-outline-variant/50">Alert ID</th>
              <th className="px-6 py-4 border-b border-outline-variant/50">Customer Name</th>
              <th className="px-6 py-4 border-b border-outline-variant/50">Triggered Rule</th>
              <th className="px-6 py-4 border-b border-outline-variant/50">Amount (INR)</th>
              <th className="px-6 py-4 border-b border-outline-variant/50">Severity</th>
              <th className="px-6 py-4 border-b border-outline-variant/50">Status</th>
              <th className="px-6 py-4 border-b border-outline-variant/50">Date</th>
            </tr>
          </thead>
          <tbody className="font-mono-data text-mono-data text-on-surface divide-y divide-outline-variant/30">
            {alerts.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-on-surface-variant">
                  No alerts found.
                </td>
              </tr>
            ) : (
              alerts.map((alert) => {
                const severityColors = {
                  HIGH: 'text-error bg-error/10 border-error/20',
                  MEDIUM: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
                  LOW: 'text-primary bg-primary/10 border-primary/20',
                };
                const severityStyle = severityColors[alert.severity] || 'text-on-surface-variant bg-surface-container-highest border-outline-variant/30';

                return (
                  <tr key={alert.id} className="hover:bg-surface-container-high/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-primary">
                      {alert.id.substring(0, 8)}...
                    </td>
                    <td className="px-6 py-4">{alert.customerName}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{alert.triggeredRule}</td>
                    <td className="px-6 py-4 font-bold">{alert.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full border font-label-md text-[10px] ${severityStyle}`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={alert.status} />
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {new Date(alert.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}