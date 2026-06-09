import React from 'react';

export default function ApprovalReviewPanel({ scenarioData, onSubmit, isSubmitting }) {
  if (!scenarioData) return null;

  const { name, actions_summary, guardrails = [] } = scenarioData;

  return (
    <div className='bg-surface-container-lowest p-stack-md rounded-xl border border-outline-variant shadow-sm'>
      <h2 className='font-headline-sm text-headline-sm mb-4'>Approval Review Panel</h2>

      {/* Scenario Summary */}
      <div className='bg-surface border border-outline-variant rounded-lg p-stack-md mb-6'>
        <h3 className='font-label-md text-on-surface mb-3 flex items-center gap-2'>
          <span className='material-symbols-outlined text-secondary text-[18px]'>insights</span>
          {name} Action Plan
        </h3>
        <p className='text-body-md text-secondary mb-4'>{actions_summary}</p>
      </div>

      {/* Guardrail Status */}
      <div className='space-y-3 mb-stack-lg'>
        <label className='text-label-md text-secondary uppercase tracking-wider block'>Policy Guardrails</label>
        {guardrails.map((guardrail, idx) => {
          const isPassing = guardrail.status?.toLowerCase() === 'passing';
          return (
            <div
              key={idx}
              className='flex items-center justify-between p-2 rounded-lg bg-surface-container-low border border-outline-variant'
            >
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
    </div>
  );
}
