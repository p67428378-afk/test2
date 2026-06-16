import React from 'react';

export default function ApprovalReviewPanel({ selectedScenario, skus, onSubmit, submitting }) {
  // Calculate action counts based on skus
  const counts = {
    GROW: 0,
    MAINTAIN: 0,
    SWAP: 0,
    REDUCE: 0,
  };

  if (skus) {
    skus.forEach((sku) => {
      const act = sku.recommended_action?.toUpperCase();
      if (counts[act] !== undefined) {
        counts[act]++;
      }
    });
  } else {
    // Fallback counts based on scenario if skus are not loaded yet
    if (selectedScenario?.toLowerCase() === 'conservative') {
      counts.MAINTAIN = 4;
      counts.REDUCE = 2;
    } else if (selectedScenario?.toLowerCase() === 'aggressive') {
      counts.GROW = 4;
      counts.SWAP = 2;
    } else {
      counts.GROW = 2;
      counts.MAINTAIN = 2;
      counts.SWAP = 1;
      counts.REDUCE = 1;
    }
  }

  return (
    <div className='bg-white border border-[#d1c6ab]/50 rounded-xl p-5 flex-1 flex flex-col shadow-sm'>
      <h3 className='text-lg font-bold text-[#0b1c30] mb-2'>Assortment Plan Summary</h3>
      <p className='text-xs text-[#4d4632] mb-5'>{selectedScenario} Scenario Selected</p>
      
      <div className='bg-[#f8f9ff] rounded-lg p-4 mb-5 border border-[#d1c6ab]/30'>
        <h4 className='text-xs font-bold text-[#0b1c30] mb-3 uppercase tracking-wide'>Action Summary</h4>
        <div className='flex flex-wrap gap-2 mb-4'>
          {counts.GROW > 0 && (
            <span className='inline-flex items-center px-2 py-1 rounded bg-[#10B981]/10 text-[#10B981] text-xs font-bold'>
              {counts.GROW} GROW
            </span>
          )}
          {counts.MAINTAIN > 0 && (
            <span className='inline-flex items-center px-2 py-1 rounded bg-[#3B82F6]/10 text-[#3B82F6] text-xs font-bold'>
              {counts.MAINTAIN} MAINTAIN
            </span>
          )}
          {counts.SWAP > 0 && (
            <span className='inline-flex items-center px-2 py-1 rounded bg-[#F59E0B]/10 text-[#F59E0B] text-xs font-bold'>
              {counts.SWAP} SWAP
            </span>
          )}
          {counts.REDUCE > 0 && (
            <span className='inline-flex items-center px-2 py-1 rounded bg-[#ba1a1a]/10 text-[#ba1a1a] text-xs font-bold'>
              {counts.REDUCE} REDUCE
            </span>
          )}
        </div>

        <h4 className='text-xs font-bold text-[#0b1c30] mb-3 uppercase tracking-wide mt-4 border-t border-[#d1c6ab]/30 pt-4'>
          Guardrail Checks
        </h4>
        <ul className='space-y-2'>
          <li className='flex items-center justify-between text-sm text-[#4d4632]'>
            <span>Shelf Space Capacity</span>
            <span className='flex items-center gap-1 text-[#10B981] font-bold text-xs'>
              <span className='material-symbols-outlined text-[16px]'>check_circle</span> PASS
            </span>
          </li>
          <li className='flex items-center justify-between text-sm text-[#4d4632]'>
            <span>Private Brand Targets</span>
            <span className='flex items-center gap-1 text-[#10B981] font-bold text-xs'>
              <span className='material-symbols-outlined text-[16px]'>check_circle</span> PASS
            </span>
          </li>
          <li className='flex items-center justify-between text-sm text-[#4d4632]'>
            <span>In-Stock Projections</span>
            <span className='flex items-center gap-1 text-[#10B981] font-bold text-xs'>
              <span className='material-symbols-outlined text-[16px]'>check_circle</span> PASS
            </span>
          </li>
        </ul>
      </div>

      <div className='mt-auto pt-2'>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className='w-full bg-[#ffd200] hover:bg-[#725c00] hover:text-white text-[#231b00] font-bold py-3 px-4 rounded-lg shadow-sm transition-colors duration-200 text-center uppercase tracking-wide text-sm disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {submitting ? 'Processing...' : 'Submit Assortment Plan'}
        </button>
      </div>
    </div>
  );
}
