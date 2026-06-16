import React from 'react';
import Button from '../common/Button';

export default function ApprovalReviewPanel({ scenario, skuActions, guardrailStatus, onSubmit, isSubmitting }) {
  // Calculate action counts dynamically
  const actionCounts = (skuActions || []).reduce(
    (acc, item) => {
      const act = item.action.toUpperCase();
      if (acc[act] !== undefined) {
        acc[act]++;
      }
      return acc;
    },
    { GROW: 0, MAINTAIN: 0, SWAP: 0, REDUCE: 0 }
  );

  const privateBrandOk = guardrailStatus?.private_brand_ok ?? true;

  return (
    <div className='bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm p-4 flex-1 flex flex-col'>
      <h3 className='font-headline-md text-headline-md font-bold text-on-surface mb-4'>
        Scenario Approval Review
      </h3>
      
      <div className='mb-4'>
        <span className='font-label-bold text-label-bold text-secondary uppercase block mb-1'>
          Selected Scenario
        </span>
        <span className='font-body-lg text-body-lg font-medium capitalize'>
          {scenario} Scenario
        </span>
      </div>

      <div className='mb-4'>
        <span className='font-label-bold text-label-bold text-secondary uppercase block mb-2'>
          Recommended Actions
        </span>
        <div className='flex flex-wrap gap-2'>
          <div className='flex items-center gap-1 bg-[#e6f4ea] text-[#146c2e] px-2 py-1 rounded-DEFAULT font-label-bold text-label-bold'>
            GROW{' '}
            <span className='bg-[#146c2e] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]'>
              {actionCounts.GROW}
            </span>
          </div>
          <div className='flex items-center gap-1 bg-[#e1f0fa] text-[#005a9e] px-2 py-1 rounded-DEFAULT font-label-bold text-label-bold'>
            MAINTAIN{' '}
            <span className='bg-[#005a9e] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]'>
              {actionCounts.MAINTAIN}
            </span>
          </div>
          <div className='flex items-center gap-1 bg-[#fff0d4] text-[#b05c00] px-2 py-1 rounded-DEFAULT font-label-bold text-label-bold'>
            SWAP{' '}
            <span className='bg-[#b05c00] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]'>
              {actionCounts.SWAP}
            </span>
          </div>
          <div className='flex items-center gap-1 bg-[#fce8e8] text-[#a50e0e] px-2 py-1 rounded-DEFAULT font-label-bold text-label-bold'>
            REDUCE{' '}
            <span className='bg-[#a50e0e] text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px]'>
              {actionCounts.REDUCE}
            </span>
          </div>
        </div>
      </div>

      <div className='mb-6'>
        <span className='font-label-bold text-label-bold text-secondary uppercase block mb-2'>
          Guardrails Status
        </span>
        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between border-b border-outline-variant pb-2'>
            <span className='font-body-md text-body-md text-secondary'>Private Brand % &gt; 20%</span>
            {privateBrandOk ? (
              <span className='material-symbols-outlined text-[#146c2e]'>check_circle</span>
            ) : (
              <span className='material-symbols-outlined text-error'>cancel</span>
            )}
          </div>
          <div className='flex items-center justify-between border-b border-outline-variant pb-2'>
            <span className='font-body-md text-body-md text-secondary'>Shelf Capacity &lt; 90%</span>
            <span className='material-symbols-outlined text-[#146c2e]'>check_circle</span>
          </div>
        </div>
      </div>

      <Button
        variant='submit'
        onClick={onSubmit}
        disabled={isSubmitting}
        className='mt-auto'
      >
        {isSubmitting ? 'Submitting...' : 'Submit Assortment Plan'}
      </Button>
    </div>
  );
}
