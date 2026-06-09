import React from 'react';

export default function ApprovalReviewPanel({ scenarioName, scenarioData, onSubmit, isSubmitting }) {
  const defaultActions = [
    { action_type: 'GROW', name: 'Clover Valley Chips facing' },
    { action_type: 'SWAP', name: 'Brand B for Regional alt' },
    { action_type: 'REDUCE', name: 'Brand C footprint' }
  ];

  const defaultGuardrails = [
    { name: 'Private Brand %', message: '34.8%', status: 'PASSED' },
    { name: 'Shelf Capacity', message: '84.5%', status: 'PASSED' },
    { name: 'In-Stock Risk', message: 'Low', status: 'PASSED' }
  ];

  const actions = scenarioData?.actions || defaultActions;
  const guardrails = scenarioData?.guardrails || defaultGuardrails;

  const getActionIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'GROW':
        return <span className='material-symbols-outlined text-green-400 text-[16px]'>add_circle</span>;
      case 'SWAP':
        return <span className='material-symbols-outlined text-amber-400 text-[16px]'>swap_horiz</span>;
      case 'REDUCE':
        return <span className='material-symbols-outlined text-red-400 text-[16px]'>remove_circle</span>;
      default:
        return <span className='material-symbols-outlined text-blue-400 text-[16px]'>info</span>;
    }
  };

  return (
    <div className='dg-card rounded-xl flex flex-col flex-1 overflow-hidden'>
      <div className='p-4 border-b border-[#334155] shrink-0 bg-[#1E293B]'>
        <h3 className='text-body-md font-body-md font-bold text-on-surface flex items-center gap-1 text-sm'>
          <span className='material-symbols-outlined text-secondary text-[18px]'>fact_check</span>
          Approval Review — {scenarioName}
        </h3>
      </div>
      <div className='p-4 flex-1 overflow-y-auto bg-[#0F172A]/50 flex flex-col gap-4'>
        <div>
          <h4 className='text-label-caps font-label-caps text-on-surface-variant uppercase mb-2 tracking-wider text-xs font-bold'>
            Key Actions
          </h4>
          <ul className='space-y-2 text-body-sm font-body-sm text-sm'>
            {actions.map((action, idx) => (
              <li key={idx} className='flex items-center gap-2 bg-[#1E293B] p-2 rounded border border-[#334155]'>
                {getActionIcon(action.action_type)}
                <span className='text-on-surface'>
                  {action.action_type?.charAt(0).toUpperCase() + action.action_type?.slice(1).toLowerCase()}{' '}
                  <span className='font-bold'>{action.name}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className='text-label-caps font-label-caps text-on-surface-variant uppercase mb-2 tracking-wider text-xs font-bold'>
            Status Checks
          </h4>
          <div className='bg-[#1E293B] border border-[#334155] rounded p-3 flex flex-col gap-2 text-body-sm font-body-sm text-sm'>
            {guardrails.map((guard, idx) => (
              <div key={idx} className='flex items-center justify-between'>
                <div className='flex items-center gap-1'>
                  <span className={`material-symbols-outlined text-[16px] ${guard.status === 'PASSED' ? 'text-green-400' : 'text-red-400'}`}>
                    {guard.status === 'PASSED' ? 'check_circle' : 'cancel'}
                  </span>
                  <span className='text-on-surface-variant'>{guard.name}</span>
                </div>
                <span className={`font-data-mono ${guard.message === 'Low' ? 'font-bold text-green-400' : 'text-on-surface'}`}>
                  {guard.message}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='p-4 border-t border-[#334155] shrink-0 bg-[#1E293B]'>
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className='w-full bg-[#6366F1] hover:bg-[#4f46e5] disabled:bg-indigo-500/50 text-white font-body-md font-bold py-2 px-4 rounded transition-colors flex items-center justify-center gap-1 shadow-lg shadow-indigo-500/20 text-sm'
        >
          <span className='material-symbols-outlined text-[20px]'>send</span>
          {isSubmitting ? 'Submitting...' : 'Submit Assortment Plan'}
        </button>
      </div>
    </div>
  );
}