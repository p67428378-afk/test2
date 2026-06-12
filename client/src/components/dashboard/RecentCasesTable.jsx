import React from 'react';
import { Link } from 'react-router-dom';
import Badge from '../common/Badge';

export default function RecentCasesTable({ customers = [], onFilterClick, onExportCSV }) {
  return (
    <div className="bg-surface-container rounded-lg border border-outline-variant overflow-hidden flex flex-col">
      <div className="p-6 border-b border-outline-variant/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Recent Flagged Cases</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Review items requiring immediate attention based on engine scoring.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onFilterClick}
            className="px-4 py-2 bg-transparent border border-outline-variant rounded-md text-on-surface hover:bg-surface-container-highest transition-colors font-mono-data text-mono-data flex items-center gap-2"
          >
            Filter
          </button>
          <button
            onClick={onExportCSV}
            className="px-4 py-2 bg-primary text-on-primary rounded-md hover:bg-primary-container transition-colors font-mono-data text-mono-data"
          >
            Export CSV
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-surface-container-highest/50 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 border-b border-outline-variant/50 w-2"></th>
              <th className="px-6 py-4 border-b border-outline-variant/50">Customer ID</th>
              <th className="px-6 py-4 border-b border-outline-variant/50">Name</th>
              <th className="px-6 py-4 border-b border-outline-variant/50">Email</th>
              <th className="px-6 py-4 border-b border-outline-variant/50">Risk Score</th>
              <th className="px-6 py-4 border-b border-outline-variant/50">Status</th>
              <th className="px-6 py-4 border-b border-outline-variant/50">Date</th>
              <th className="px-6 py-4 border-b border-outline-variant/50 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="font-mono-data text-mono-data text-on-surface divide-y divide-outline-variant/30">
            {customers.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-6 py-8 text-center text-on-surface-variant">
                  No cases found.
                </td>
              </tr>
            ) : (
              customers.map((customer) => {
                const borderColors = {
                  APPROVED: 'border-emerald-500',
                  REVIEW: 'border-amber-500',
                  FLAGGED: 'border-error',
                };
                const borderColor = borderColors[customer.status] || 'border-outline-variant';

                return (
                  <tr key={customer.id} className="hover:bg-surface-container-high/50 transition-colors group">
                    <td className={`p-0 border-l-4 ${borderColor}`}></td>
                    <td className="px-6 py-4 font-bold text-primary">
                      <Link to={`/cases/${customer.id}`} className="hover:underline">
                        {customer.id.substring(0, 8)}...
                      </Link>
                    </td>
                    <td className="px-6 py-4">{`${customer.firstName} ${customer.lastName}`}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{customer.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              customer.riskScore > 70
                                ? 'bg-error'
                                : customer.riskScore > 30
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${customer.riskScore}%` }}
                          ></div>
                        </div>
                        <span>{customer.riskScore}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={customer.status} />
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/cases/${customer.id}`}
                        className="text-primary hover:text-primary-container font-label-md text-label-md uppercase opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Review
                      </Link>
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