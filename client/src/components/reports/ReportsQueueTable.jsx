import React from 'react';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function ReportsQueueTable({ reports = [], onPreview, onSubmit, isSubmitting }) {
  return (
    <div className="bg-surface-container rounded-lg border border-outline-variant overflow-hidden flex flex-col">
      <div className="p-6 border-b border-outline-variant/50">
        <h2 className="font-headline-md text-headline-md text-on-surface">Regulatory Reports Queue</h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
          Auto-generated Suspicious Transaction Reports (STR) and Cash Transaction Reports (CTR) for FIU-IND filing.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-surface-container-highest/50 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 border-b border-outline-variant/50">Report ID</th>
              <th className="px-6 py-4 border-b border-outline-variant/50">Customer Name</th>
              <th className="px-6 py-4 border-b border-outline-variant/50">Report Type</th>
              <th className="px-6 py-4 border-b border-outline-variant/50">Status</th>
              <th className="px-6 py-4 border-b border-outline-variant/50">Date</th>
              <th className="px-6 py-4 border-b border-outline-variant/50 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="font-mono-data text-mono-data text-on-surface divide-y divide-outline-variant/30">
            {reports.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-on-surface-variant">
                  No reports found.
                </td>
              </tr>
            ) : (
              reports.map((report) => (
                <tr key={report.id} className="hover:bg-surface-container-high/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-primary">
                    {report.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4">{report.customerName || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 rounded bg-surface-container-highest border border-outline-variant/30 font-bold text-xs">
                      {report.reportType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge status={report.status} />
                  </td>
                  <td className="px-6 py-4 text-on-surface-variant">
                    {new Date(report.createdDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button
                      variant="secondary"
                      onClick={() => onPreview(report)}
                      className="px-3 py-1 text-xs"
                    >
                      Preview XML
                    </Button>
                    {report.status === 'PENDING' && (
                      <Button
                        variant="primary"
                        onClick={() => onSubmit(report.id)}
                        disabled={isSubmitting}
                        className="px-3 py-1 text-xs"
                      >
                        Submit
                      </Button>
                    )}
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