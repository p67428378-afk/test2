import React, { useState } from 'react';

export default function ApprovalPanel({
  proposedChanges,
  guardrails,
  kpis,
  onSubmit,
  onReset,
  submitResult,
  isSubmitting
}) {
  const [approvedBy, setApprovedBy] = useState('Sarah Chen');

  const pbCheck = guardrails?.private_brand_check ?? true;
  const capCheck = guardrails?.shelf_capacity_check ?? true;
  const isSubmitDisabled = !pbCheck || !capCheck || isSubmitting;

  const addCount = proposedChanges?.add ?? 3;
  const keepCount = proposedChanges?.keep ?? 42;
  const swapCount = proposedChanges?.swap ?? 2;
  const removeCount = proposedChanges?.remove ?? 1;

  const pbPct = kpis?.private_brand_pct ?? 18.5;
  const capPct = kpis?.shelf_capacity_utilized ?? 88.4;

  if (submitResult) {
    return (
      <section aria-label='Approval Confirmation' className='bg-surface-container-lowest border border-surface-variant rounded-lg shadow-sm p-md mt-4'>
        <div className='flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-surface-variant pb-4 mb-4'>
          <div className='flex items-center gap-3'>
            <span className='material-symbols-outlined text-[#166534] text-[32px]'>check_circle</span>
            <div>
              <h3 className='font-headline-sm text-headline-sm text-on-surface'>Assortment Plan Approved Successfully</h3>
              <p className='font-body-md text-body-md text-on-surface-variant mt-0.5'>
                The plan has been submitted and logged to the audit trail.
              </p>
            </div>
          </div>
          <button
            onClick={onReset}
            className='px-4 py-2 bg-surface-container border border-outline-variant text-on-surface font-label-md text-label-md rounded hover:bg-surface-variant transition-colors'
          >
            Create New Plan
          </button>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-body-md text-body-md'>
          <div className='bg-surface-container-low p-3 rounded'>
            <div className='text-on-surface-variant font-label-sm text-[10px] uppercase mb-1'>Transaction ID</div>
            <div className='font-semibold text-on-surface'>{submitResult.transaction_id || 'TXN-987654321'}</div>
          </div>
          <div className='bg-surface-container-low p-3 rounded'>
            <div className='text-on-surface-variant font-label-sm text-[10px] uppercase mb-1'>Timestamp</div>
            <div className='font-semibold text-on-surface'>
              {submitResult.timestamp ? new Date(submitResult.timestamp).toLocaleString() : '2026-01-01 12:00:00'}
            </div>
          </div>
          <div className='bg-surface-container-low p-3 rounded'>
            <div className='text-on-surface-variant font-label-sm text-[10px] uppercase mb-1'>Approved By</div>
            <div className='font-semibold text-on-surface'>{submitResult.approved_by || 'Sarah Chen'}</div>
          </div>
          <div className='bg-surface-container-low p-3 rounded'>
            <div className='text-on-surface-variant font-label-sm text-[10px] uppercase mb-1'>Scenario Applied</div>
            <div className='font-semibold text-on-surface'>{submitResult.summary?.scenario || 'Balanced'}</div>
          </div>
        </div>

        <div className='mt-4 bg-surface-container-low p-4 rounded'>
          <h4 className='font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2'>Audit Trail Summary</h4>
          <p className='font-body-md text-body-md text-on-surface'>
            <span className='font-semibold text-[#166534]'>Added {submitResult.summary?.added_skus ?? addCount}</span> SKUs, 
            <span className='font-semibold text-[#991B1B]'> Removed {submitResult.summary?.removed_skus ?? removeCount}</span> SKUs, 
            <span className='font-semibold text-[#92400E]'> Swapped {submitResult.summary?.swapped_skus ?? swapCount}</span> SKUs. 
            Total active SKUs in assortment: <span className='font-semibold text-on-surface'>{submitResult.summary?.total_skus ?? 19}</span>.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section aria-label='Action Panel' className='bg-surface-container-lowest border border-surface-variant rounded-lg shadow-sm p-md flex flex-col lg:flex-row gap-6 items-center justify-between mt-4'>
      <div className='flex-1 w-full border-b lg:border-b-0 lg:border-r border-surface-variant pb-4 lg:pb-0 lg:pr-6'>
        <h4 className='font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2'>Proposed Changes</h4>
        <p className='font-body-md text-body-md text-on-surface'>
          <span className='font-semibold text-[#166534]'>Add {addCount}</span> SKUs, 
          <span className='font-semibold text-[#1E40AF]'> Keep {keepCount}</span> SKUs, 
          <span className='font-semibold text-[#92400E]'> Swap {swapCount}</span> SKUs, 
          <span className='font-semibold text-[#991B1B]'> Remove {removeCount}</span> SKU
        </p>
      </div>

      <div className='flex-1 w-full border-b lg:border-b-0 lg:border-r border-surface-variant pb-4 lg:pb-0 lg:px-6'>
        <h4 className='font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2'>Guardrail Status</h4>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between font-body-md text-body-md'>
            <span className='text-on-surface'>Private Brand % &gt;= 15.0%</span>
            <span className={`flex items-center font-medium ${pbCheck ? 'text-[#166534]' : 'text-[#ba1a1a]'}`}>
              {pbPct.toFixed(1)}% 
              <span className='material-symbols-outlined ml-1 text-[18px]'>
                {pbCheck ? 'check_circle' : 'cancel'}
              </span>
            </span>
          </div>
          <div className='flex items-center justify-between font-body-md text-body-md'>
            <span className='text-on-surface'>Shelf Capacity &lt;= 95.0%</span>
            <span className={`flex items-center font-medium ${capCheck ? 'text-[#166534]' : 'text-[#ba1a1a]'}`}>
              {capPct.toFixed(1)}% 
              <span className='material-symbols-outlined ml-1 text-[18px]'>
                {capCheck ? 'check_circle' : 'cancel'}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className='flex-shrink-0 w-full lg:w-auto flex flex-col sm:flex-row gap-3 lg:pl-6 items-center'>
        <div className='flex flex-col w-full sm:w-auto'>
          <label htmlFor='approvedBy' className='text-xs text-on-surface-variant mb-1 font-semibold uppercase'>Approved By</label>
          <input
            id='approvedBy'
            type='text'
            className='border border-outline-variant rounded px-3 py-1.5 text-sm focus:outline-none focus:border-primary w-full'
            value={approvedBy}
            onChange={(e) => setApprovedBy(e.target.value)}
          />
        </div>
        <div className='flex gap-3 w-full sm:w-auto mt-4 sm:mt-0'>
          <button
            onClick={onReset}
            className='px-6 py-2.5 bg-surface-container-lowest border border-outline-variant text-on-surface font-label-md text-label-md rounded hover:bg-surface-container-low transition-colors shadow-sm flex-1 sm:flex-none'
          >
            Reset
          </button>
          <button
            onClick={() => onSubmit(approvedBy)}
            disabled={isSubmitDisabled}
            className={`px-6 py-2.5 font-label-md text-label-md font-bold rounded transition-colors shadow-sm flex-1 sm:flex-none flex items-center justify-center gap-2 ${isSubmitDisabled ? 'bg-surface-variant text-on-surface-variant cursor-not-allowed' : 'bg-primary-container text-[#0F172A] hover:bg-primary-fixed-dim'}`}
          >
            <span className='material-symbols-outlined text-[20px]'>upload</span> 
            {isSubmitting ? 'Submitting...' : 'Submit Assortment Plan'}
          </button>
        </div>
      </div>
    </section>
  );
}