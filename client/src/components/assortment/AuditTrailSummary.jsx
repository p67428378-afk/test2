import React from 'react';

const AuditTrailSummary = ({ auditData }) => {
  if (!auditData) return null;

  const { audit_id, submitted_by, summary, timestamp } = auditData;
  const formattedDate = new Date(timestamp).toLocaleString();

  return (
    <div className='bg-surface-container rounded-lg p-6 border border-outline-variant/30 space-y-6'>
      <div className='border-b border-outline-variant pb-4'>
        <h3 className='text-lg font-bold text-primary-container'>Audit Trail Summary</h3>
        <p className='text-xs text-on-surface-variant mt-1'>Official record of assortment approval</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='space-y-3'>
          <div>
            <p className='text-xs text-on-surface-variant uppercase tracking-wider'>Submission ID</p>
            <p className='text-sm font-mono text-secondary'>{audit_id}</p>
          </div>
          <div>
            <p className='text-xs text-on-surface-variant uppercase tracking-wider'>Submitted By</p>
            <p className='text-sm font-semibold text-on-surface'>{submitted_by}</p>
          </div>
          <div>
            <p className='text-xs text-on-surface-variant uppercase tracking-wider'>Timestamp</p>
            <p className='text-sm font-semibold text-on-surface'>{formattedDate}</p>
          </div>
        </div>

        <div className='bg-background p-4 rounded border border-outline-variant/20 space-y-3'>
          <h4 className='text-xs font-bold text-on-surface uppercase tracking-wider'>Assortment Impact</h4>
          <div className='flex justify-between items-center text-sm'>
            <span className='text-on-surface-variant'>Scenario Name</span>
            <span className='font-bold text-on-surface'>{summary?.scenario_name}</span>
          </div>
          <div className='flex justify-between items-center text-sm'>
            <span className='text-on-surface-variant'>Projected Sales Impact</span>
            <span className={`font-bold ${summary?.projected_sales_impact >= 0 ? 'text-green-status' : 'text-red-status'}`}>
              {summary?.projected_sales_impact >= 0 ? '+' : ''}${summary?.projected_sales_impact?.toLocaleString()}
            </span>
          </div>
          <div className='flex justify-between items-center text-sm'>
            <span className='text-on-surface-variant'>SKUs Added</span>
            <span className='font-bold text-on-surface'>{summary?.total_skus_added}</span>
          </div>
          <div className='flex justify-between items-center text-sm'>
            <span className='text-on-surface-variant'>SKUs Removed</span>
            <span className='font-bold text-on-surface'>{summary?.total_skus_removed}</span>
          </div>
          <div className='flex justify-between items-center text-sm'>
            <span className='text-on-surface-variant'>SKUs Swapped</span>
            <span className='font-bold text-on-surface'>{summary?.total_skus_swapped}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditTrailSummary;
