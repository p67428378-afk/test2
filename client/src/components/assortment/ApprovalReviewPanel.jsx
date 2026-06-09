import React from 'react';

export default function ApprovalReviewPanel({ selectedScenarioDetails, onSubmit, isSubmitting }) {
  if (!selectedScenarioDetails) {
    return (
      <div className='bg-surface-container-lowest rounded-lg shadow-level-2 border border-outline-variant/30 p-md flex items-center justify-center h-64'>
        <span className='text-on-surface-variant'>Loading scenario details...</span>
      </div>
    );
  }

  const { name, projected_sales_change_pct, projected_profit_change_pct, projected_private_brand_pct, actions, guardrails } = selectedScenarioDetails;

  // Check if any guardrail failed
  const hasFailedGuardrails = guardrails?.some(g => !g.passed);

  return (
    <div className='bg-surface-container-lowest rounded-lg shadow-level-2 border border-outline-variant/30 flex flex-col flex-1'>
      <div className='p-md border-b border-outline-variant/30 bg-surface'>
        <h2 className='font-headline-sm text-headline-sm font-bold text-on-surface'>Approval Review</h2>
      </div>
      <div className='p-md flex flex-col gap-md flex-1'>
        <div>
          <div className='text-xs text-on-surface-variant font-medium uppercase tracking-wider mb-1'>Summary</div>
          <div className='font-medium'>Scenario: <span className='font-bold text-on-surface'>{name}</span></div>
        </div>
        <div>
          <div className='text-xs text-on-surface-variant font-medium uppercase tracking-wider mb-1'>Impact</div>
          <div className='flex gap-4 text-sm font-data-tabular'>
            <div className='flex flex-col'>
              <span className='text-on-surface-variant'>Sales</span>
              <span className={`font-bold ${projected_sales_change_pct >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {projected_sales_change_pct >= 0 ? '+' : ''}{projected_sales_change_pct}%
              </span>
            </div>
            <div className='flex flex-col'>
              <span className='text-on-surface-variant'>Profit</span>
              <span className={`font-bold ${projected_profit_change_pct >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                {projected_profit_change_pct >= 0 ? '+' : ''}{projected_profit_change_pct}%
              </span>
            </div>
            <div className='flex flex-col'>
              <span className='text-on-surface-variant'>PB</span>
              <span className='font-bold text-on-surface'>{projected_private_brand_pct}%</span>
            </div>
          </div>
        </div>
        <div className='flex-1'>
          <div className='text-xs text-on-surface-variant font-medium uppercase tracking-wider mb-2'>Action List</div>
          {actions && actions.length > 0 ? (
            <ul className='text-sm space-y-2'>
              {actions.map((act, idx) => (
                <li key={idx} className='flex items-start gap-2'>
                  {act.action === 'SWAP' ? (
                    <span className='material-symbols-outlined text-[16px] text-amber-600 mt-0.5'>swap_horiz</span>
                  ) : act.action === 'REDUCE' ? (
                    <span className='material-symbols-outlined text-[16px] text-red-600 mt-0.5'>trending_down</span>
                  ) : act.action === 'GROW' ? (
                    <span className='material-symbols-outlined text-[16px] text-green-600 mt-0.5'>trending_up</span>
                  ) : (
                    <span className='material-symbols-outlined text-[16px] text-blue-600 mt-0.5'>check_circle</span>
                  )}
                  <span className='text-on-surface'>
                    {act.action === 'SWAP' ? (
                      <span>Swap <span className='font-bold'>{act.sku_name}</span> with <span className='font-bold'>Clover Valley Alternative</span></span>
                    ) : act.action === 'REDUCE' ? (
                      <span>Reduce <span className='font-bold'>{act.sku_name}</span> space by 20%</span>
                    ) : (
                      <span>{act.action} <span className='font-bold'>{act.sku_name}</span></span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <span className='text-sm text-on-surface-variant'>No actions required for this scenario.</span>
          )}
        </div>
        <div className='bg-surface rounded p-3 border border-outline-variant/30'>
          <div className='text-xs text-on-surface-variant font-medium uppercase tracking-wider mb-2'>Guardrails</div>
          <div className='flex flex-col gap-1 text-sm'>
            {guardrails && guardrails.length > 0 ? (
              guardrails.map((g, idx) => (
                <div key={idx} className='flex items-center justify-between'>
                  <span>{g.name}</span>
                  <div className='flex items-center gap-1'>
                    <span className='text-xs text-on-surface-variant'>{g.value}</span>
                    {g.passed ? (
                      <span className='material-symbols-outlined text-green-600 text-[18px]'>check_circle</span>
                    ) : (
                      <span className='material-symbols-outlined text-red-600 text-[18px]'>cancel</span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <span className='text-xs text-on-surface-variant'>No guardrails configured.</span>
            )}
          </div>
        </div>
      </div>
      <div className='p-md mt-auto pt-0'>
        <button
          onClick={onSubmit}
          disabled={isSubmitting || hasFailedGuardrails}
          className='w-full py-3 bg-primary-container text-on-background font-bold rounded-lg shadow-sm hover:bg-inverse-primary transition-colors flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isSubmitting ? 'Submitting...' : 'Submit Assortment Plan'}
          <span className='material-symbols-outlined text-[18px]'>send</span>
        </button>
        {hasFailedGuardrails && (
          <p className='text-xs text-red-600 mt-2 text-center'>
            Cannot submit: Guardrails not met.
          </p>
        )}
      </div>
    </div>
  );
}
