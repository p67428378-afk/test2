import React from 'react';

export default function ApprovalReviewPanel({
  selectedScenario,
  skuActions,
  kpis,
  onSubmit,
  submitResult,
  isSubmitting,
  submitError,
}) {
  // Count actions
  const actionCounts = {
    GROW: 0,
    MAINTAIN: 0,
    REDUCE: 0,
    SWAP: 0,
  };

  Object.values(skuActions).forEach((action) => {
    if (actionCounts[action] !== undefined) {
      actionCounts[action]++;
    }
  });

  // Guardrail checks based on scenario
  const isAggressive = selectedScenario.toLowerCase() === 'aggressive';
  const pbProjected = isAggressive ? '18.5%' : selectedScenario.toLowerCase() === 'conservative' ? '22.5%' : '24.1%';
  const skuCountProjected = isAggressive ? '+4.5%' : selectedScenario.toLowerCase() === 'conservative' ? '-0.5%' : '-1.2%';

  return (
    <div className='bg-dark-slate rounded-lg p-stack-lg mt-auto flex-grow flex flex-col card-shadow text-white'>
      <h3 className='font-headline-sm text-headline-sm mb-4 border-b border-gray-700 pb-2'>
        Review: {selectedScenario} Scenario
      </h3>
      <div className='space-y-4 mb-6 flex-grow'>
        <div>
          <div className='font-label-md text-label-md text-gray-400 uppercase tracking-wider mb-2'>
            SKU Actions Summary
          </div>
          <div className='flex flex-wrap gap-3 font-body-md text-body-md bg-white/5 p-3 rounded'>
            <span className='text-green-400 font-medium'>GROW: {actionCounts.GROW} SKUs</span>
            <span className='text-gray-500'>|</span>
            <span className='text-blue-400 font-medium'>MAINTAIN: {actionCounts.MAINTAIN} SKUs</span>
            <span className='text-gray-500'>|</span>
            <span className='text-red-400 font-medium'>REDUCE: {actionCounts.REDUCE} SKUs</span>
            <span className='text-gray-500'>|</span>
            <span className='text-orange-400 font-medium'>SWAP: {actionCounts.SWAP} SKUs</span>
          </div>
        </div>
        <div>
          <div className='font-label-md text-label-md text-gray-400 uppercase tracking-wider mb-2'>
            Guardrail Checks
          </div>
          <ul className='space-y-2 font-body-md text-body-md'>
            <li className='flex items-start gap-2'>
              {isAggressive ? (
                <span
                  className='material-symbols-outlined text-red-500 text-[20px]'
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  cancel
                </span>
              ) : (
                <span
                  className='material-symbols-outlined text-green-400 text-[20px]'
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  check_circle
                </span>
              )}
              <span>
                PB% &gt; 20%{' '}
                <span className={isAggressive ? 'text-red-400' : 'text-gray-400'}>
                  (Projected: {pbProjected})
                </span>
              </span>
            </li>
            <li className='flex items-start gap-2'>
              <span
                className='material-symbols-outlined text-green-400 text-[20px]'
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                check_circle
              </span>
              <span>
                SKU count within 5%{' '}
                <span className='text-gray-400'>(Projected: {skuCountProjected})</span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className='mt-auto'>
        {submitError && (
          <div className='bg-red-900/40 border border-red-800 rounded p-3 text-xs text-red-300 mb-3'>
            <div className='font-semibold mb-1 flex items-center gap-1'>
              <span className='material-symbols-outlined text-[16px]'>error</span>
              Submission Failed
            </div>
            <div>{submitError}</div>
          </div>
        )}

        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className='w-full bg-amber hover:bg-amber/90 disabled:opacity-50 transition-colors py-3 px-4 rounded-lg font-bold text-body-lg dark-slate mb-3 flex justify-center items-center gap-2'
        >
          <span className='material-symbols-outlined'>
            {isSubmitting ? 'hourglass_empty' : 'send'}
          </span>
          {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
        </button>

        {submitResult && (
          <div className='bg-green-900/40 border border-green-800 rounded p-3 text-xs text-green-300'>
            <div className='font-semibold mb-1 flex items-center gap-1'>
              <span className='material-symbols-outlined text-[16px]'>task_alt</span>
              Assortment changes submitted successfully.
            </div>
            <div className='break-all'>
              Tracking ID: {submitResult.tracking_id} | Submitted by:{' '}
              {submitResult.submitted_by} | Timestamp:{' '}
              {new Date(submitResult.timestamp).toLocaleString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
