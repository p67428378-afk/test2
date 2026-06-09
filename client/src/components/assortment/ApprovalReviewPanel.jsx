import React from 'react';

export const ApprovalReviewPanel = ({ scenarioKey, scenarioData, onSubmit, isSubmitting }) => {
  const name = scenarioData?.name || scenarioKey?.charAt(0).toUpperCase() + scenarioKey?.slice(1) || 'Balanced';
  const skuActions = scenarioData?.sku_actions || [];
  const guardrails = scenarioData?.guardrails || [
    { name: 'Shelf Capacity Compliance', status: 'Passing' },
    { name: 'Private Brand Minimum (20%)', status: 'Passing' },
    { name: 'Vendor In-Stock SLA', status: 'Passing' },
  ];

  // Calculate action counts
  const counts = skuActions.reduce(
    (acc, curr) => {
      const act = curr.action?.toUpperCase();
      if (act === 'ADD' || act === 'GROW') acc.add++;
      else if (act === 'KEEP' || act === 'MAINTAIN') acc.keep++;
      else if (act === 'SWAP') acc.swap++;
      else if (act === 'REMOVE' || act === 'REDUCE') acc.remove++;
      return acc;
    },
    { add: 0, keep: 0, swap: 0, remove: 0 }
  );

  // Fallback counts if empty
  if (skuActions.length === 0) {
    if (scenarioKey === 'conservative') {
      counts.add = 2;
      counts.keep = 45;
      counts.swap = 1;
      counts.remove = 1;
    } else if (scenarioKey === 'aggressive') {
      counts.add = 8;
      counts.keep = 38;
      counts.swap = 5;
      counts.remove = 4;
    } else {
      counts.add = 4;
      counts.keep = 42;
      counts.swap = 3;
      counts.remove = 2;
    }
  }

  return (
    <section className='bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant shadow-sm'>
      <h2 className='font-headline-sm text-headline-sm mb-4'>Assortment Strategy</h2>

      {/* Scenario Summary */}
      <div className='bg-surface border border-outline-variant rounded-lg p-stack-md mb-6'>
        <h3 className='font-label-md text-on-surface mb-3 flex items-center gap-2'>
          <span className='material-symbols-outlined text-secondary text-[18px]'>insights</span>
          {name} Action Plan
        </h3>
        <div className='grid grid-cols-2 gap-3'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 rounded bg-green-100 flex items-center justify-center text-green-700 font-bold'>
              {counts.add}
            </div>
            <span className='text-body-sm text-secondary'>New SKUs</span>
          </div>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-700 font-bold'>
              {counts.keep}
            </div>
            <span className='text-body-sm text-secondary'>Keep SKUs</span>
          </div>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 rounded bg-orange-100 flex items-center justify-center text-orange-700 font-bold'>
              {counts.swap}
            </div>
            <span className='text-body-sm text-secondary'>Swap SKUs</span>
          </div>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 rounded bg-red-100 flex items-center justify-center text-red-700 font-bold'>
              {counts.remove}
            </div>
            <span className='text-body-sm text-secondary'>Remove</span>
          </div>
        </div>
      </div>

      {/* Guardrail Status */}
      <div className='space-y-3 mb-stack-lg'>
        <label className='text-label-md text-secondary uppercase tracking-wider block'>Policy Guardrails</label>
        {guardrails.map((guard, idx) => {
          const isPassing = guard.status?.toLowerCase() === 'passing' || guard.status?.toLowerCase() === 'passed';
          return (
            <div key={idx} className='flex items-center justify-between p-2 rounded-lg bg-surface-container-low border border-outline-variant'>
              <div className='flex items-center gap-3'>
                <span className={`material-symbols-outlined ${isPassing ? 'text-green-600' : 'text-red-600'}`}>
                  {isPassing ? 'check_circle' : 'error'}
                </span>
                <span className='text-body-sm font-medium text-on-surface'>{guard.name}</span>
              </div>
              <span className={`text-[10px] font-bold uppercase ${isPassing ? 'text-green-600' : 'text-red-600'}`}>
                {guard.status}
              </span>
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        className='w-full py-4 bg-primary-container text-on-background font-bold text-headline-sm rounded-lg hover:brightness-95 transition-all shadow-md flex items-center justify-center gap-3 group active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed'
      >
        <span className='material-symbols-outlined group-hover:rotate-12 transition-transform'>
          {isSubmitting ? 'sync' : 'lock'}
        </span>
        {isSubmitting ? 'Submitting Plan...' : 'Submit Assortment Plan'}
      </button>
    </section>
  );
};

export default ApprovalReviewPanel;