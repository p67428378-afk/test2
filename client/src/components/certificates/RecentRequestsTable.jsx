import React from 'react';
import { Download, RefreshCw, ArrowRight } from 'lucide-react';
import { getDownloadUrl } from '../../services/api';

const RecentRequestsTable = ({ requests, total, page, limit, onPageChange, onRetry }) => {
  const totalPages = Math.ceil(total / limit) || 1;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toISOString().split('T')[0];
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-bright">
        <h2 className="font-headline-sm text-headline-sm text-on-surface">Recent Certificate Requests</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Request ID</th>
              <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Account Number</th>
              <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Purpose</th>
              <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Date Requested</th>
              <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Status</th>
              <th className="py-3 px-6 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant bg-surface-container-lowest font-body-sm text-body-sm text-on-surface">
            {requests.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 px-6 text-center text-on-surface-variant">
                  No certificate requests found.
                </td>
              </tr>
            ) : (
              requests.map((req) => (
                <tr key={req.id} className="hover:bg-primary-container/5 transition-colors group">
                  <td className="py-4 px-6 font-label-md text-label-md">#{req.id.substring(0, 8).toUpperCase()}</td>
                  <td className="py-4 px-6">{req.account_number}</td>
                  <td className="py-4 px-6 capitalize">{req.purpose}</td>
                  <td className="py-4 px-6 text-on-surface-variant">{formatDate(req.request_timestamp)}</td>
                  <td className="py-4 px-6">
                    {req.status === 'SUCCESS' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#10B981]/10 text-[#047857] font-label-sm text-[11px] border border-[#10B981]/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]"></span> Success
                      </span>
                    ) : req.status === 'FAILED' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error/10 text-error font-label-sm text-[11px] border border-error/20" title={req.failure_reason}>
                        <span className="w-1.5 h-1.5 rounded-full bg-error"></span> Failed ({req.failure_reason || 'Unknown error'})
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-label-sm text-[11px] border border-amber-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Pending
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    {req.status === 'SUCCESS' ? (
                      <a
                        href={getDownloadUrl(req.id)}
                        download
                        className="text-primary-container hover:text-primary-container/80 font-label-md text-label-md transition-colors flex items-center justify-end gap-1 w-full"
                      >
                        <Download className="w-4 h-4" /> Download PDF
                      </a>
                    ) : req.status === 'FAILED' ? (
                      <button
                        onClick={() => onRetry(req)}
                        className="text-error hover:text-error/80 font-label-md text-label-md transition-colors flex items-center justify-end gap-1 w-full"
                      >
                        <RefreshCw className="w-4 h-4" /> Retry
                      </button>
                    ) : (
                      <span className="text-on-surface-variant font-label-md text-label-md">Processing...</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="p-4 border-t border-outline-variant bg-surface-bright flex justify-between items-center text-sm">
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          Showing {requests.length > 0 ? (page - 1) * limit + 1 : 0}-{Math.min(page * limit, total)} of {total} entries
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1.5 border border-outline-variant rounded bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-low transition-colors font-label-md text-label-md disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-1.5 border border-outline-variant rounded bg-surface-container-lowest text-on-surface hover:bg-surface-container-low transition-colors font-label-md text-label-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentRequestsTable;
