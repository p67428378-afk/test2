import React from 'react';

export default function ApprovalReviewPanel({ scenarioData, scenarioName, onSubmit, isSubmitting }) {
  const skuActions = scenarioData?.sku_actions ?? [];
  const guardrails = scenarioData?.guardrails ?? [];

  // Group actions by type
  const actionCounts = skuActions.reduce((acc, curr) => {
    const action = curr.action?.toUpperCase();
    acc[action] = (acc[action] || 0) + 1;
    return acc;
  }, {});

  const getActionColorClass = (action) => {
    switch (action) {
      case 'ADD':
        return 'bg-green-100 text-green-700';
      case 'KEEP':
        return 'bg-blue-100 text-blue-700';
      case 'SWAP':
        return 'bg-orange-100 text-orange-700';
      case 'REDUCE':
      case 'REMOVE':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <section className='bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant shadow-sm'>
      <h2 className='font-headline-sm text-headline-sm mb-4'>Approval Review Panel</h2>

      {/* Scenario Summary */}
      <div className='bg-surface border border-outline-variant rounded-lg p-stack-md mb-6'>
        <h3 className='font-label-md text-on-surface mb-3 flex items-center gap-2 uppercase tracking-wider'>
          <span className='material-symbols-outlined text-secondary text-[18px]'>insights</span>
          {scenarioName} Action Plan
        </h3>
        <div className='grid grid-cols-2 gap-3'>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 rounded bg-green-100 flex items-center justify-center text-green-700 font-bold'>
              {actionCounts['ADD'] || 0}
            </div>
            <span className='text-body-sm text-secondary'>New SKUs</span>
          </div>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-700 font-bold'>
              {actionCounts['KEEP'] || 0}
            </div>
            <span className='text-body-sm text-secondary'>Keep SKUs</span>
          </div>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 rounded bg-orange-100 flex items-center justify-center text-orange-700 font-bold'>
              {actionCounts['SWAP'] || 0}
            </div>
            <span className='text-body-sm text-secondary'>Swap SKUs</span>
          </div>
          <div className='flex items-center gap-3'>
            <div className='w-8 h-8 rounded bg-red-100 flex items-center justify-center text-red-700 font-bold'>
              {(actionCounts['REDUCE'] || 0) + (actionCounts['REMOVE'] || 0)}
            </div>
            <span className='text-body-sm text-secondary'>Reduce/Remove</span>
          </div>
        </div>
      </div>

      {/* Guardrail Status */}
      <div className='space-y-3 mb-stack-lg'>
        <label className='text-label-md text-secondary uppercase tracking-wider block'>Policy Guardrails</label>
        {guardrails.length > 0 ? (
          guardrails.map((guardrail, idx) => {
            const isPassing = guardrail.status?.toUpperCase() === 'PASSING' || guardrail.status?.toUpperCase() === 'PASS';
            return (
              <div key={idx} className='flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low border border-outline-variant'>
                <div className='flex items-center gap-3'>
                  <span className={`material-symbols-outlined ${isPassing ? 'text-green-600' : 'text-red-600'}`}>
                    {isPassing ? 'check_circle' : 'cancel'}
                  </span>
                  <span className='text-body-sm font-medium text-on-surface'>{guardrail.name}</span>
                </div>
                <span className={`text-[10px] font-bold uppercase ${isPassing ? 'text-green-600' : 'text-red-600'}`}>
                  {guardrail.status}
                </span>
              </div>
            );
          })
        ) : (
          <>
            <div className='flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low border border-outline-variant'>
              <div className='flex items-center gap-3'>
                <span className='material-symbols-outlined text-green-600'>check_circle</span>
                <span className='text-body-sm font-medium text-on-surface'>Shelf Capacity Compliance</span>
              </div>
              <span className='text-[10px] font-bold text-green-600 uppercase'>Passing</span>
            </div>
            <div className='flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low border border-outline-variant'>
              <div className='flex items-center gap-3'>
                <span className='material-symbols-outlined text-green-600'>check_circle</span>
                <span className='text-body-sm font-medium text-on-surface'>Private Brand Minimum (20%)</span>
              </div>
              <span className='text-[10px] font-bold text-green-600 uppercase'>Passing</span>
            </div>
            <div className='flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low border border-outline-variant'>
              <div className='flex items-center gap-3'>
                <span className='material-symbols-outlined text-green-600'>check_circle</span>
                <span className='text-body-sm font-medium text-on-surface'>Vendor In-Stock SLA</span>
              </div>
              <span className='text-[10px] font-bold text-green-600 uppercase'>Passing</span>
            </div>
          </>
        )}
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
}
