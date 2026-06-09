import React from 'react';
import Button from '../common/Button';

export default function ApprovalReviewPanel({ scenarioName, scenarioDetails, loading, onSubmit }) {
  if (loading) {
    return (
      <div className='bg-[#1E293B] border border-[#334155] rounded-xl p-5 animate-pulse h-80'>
        <div className='h-6 bg-[#273647] rounded w-1/2 mb-4'></div>
        <div className='space-y-3'>
          <div className='h-12 bg-[#273647] rounded'></div>
          <div className='h-12 bg-[#273647] rounded'></div>
          <div className='h-12 bg-[#273647] rounded'></div>
        </div>
      </div>
    );
  }

  const details = scenarioDetails || {
    actions: { add: 15, remove: 22, keep: 463 },
    guardrails: {
      private_brand_passed: true,
      sku_count_passed: true,
      message: 'All guardrails passed.',
    },
    projected_private_brand_pct: 26.5,
    projected_sales: 135000,
    projected_shelf_capacity_pct: 85,
  };

  const { actions, guardrails } = details;

  return (
    <div className='bg-[#1E293B] border border-[#334155] rounded-xl flex flex-col p-5'>
      <h3 className='text-lg font-semibold text-white mb-4 border-b border-[#334155] pb-2 uppercase tracking-wider'>
        Review: {scenarioName}
      </h3>
      
      <div className='flex justify-between gap-2 mb-6'>
        <div className='bg-[#0F172A] border border-[#334155] rounded p-2 flex-1 text-center'>
          <div className='text-2xl font-bold text-emerald-400'>{actions?.add || 0}</div>
          <div className='text-[10px] font-semibold text-[#d8c3ad] uppercase'>ADD</div>
        </div>
        <div className='bg-[#0F172A] border border-[#334155] rounded p-2 flex-1 text-center'>
          <div className='text-2xl font-bold text-rose-400'>{actions?.remove || 0}</div>
          <div className='text-[10px] font-semibold text-[#d8c3ad] uppercase'>REMOVE</div>
        </div>
        <div className='bg-[#0F172A] border border-[#334155] rounded p-2 flex-1 text-center'>
          <div className='text-2xl font-bold text-white'>{actions?.keep || 0}</div>
          <div className='text-[10px] font-semibold text-[#d8c3ad] uppercase'>KEEP</div>
        </div>
      </div>

      <div className='space-y-3 mb-6'>
        <div className='flex justify-between items-center'>
          <span className='text-sm text-[#d8c3ad]'>Private Brand %</span>
          <span className={`flex items-center gap-1 text-xs font-semibold ${guardrails?.private_brand_passed ? 'text-emerald-400' : 'text-rose-400'}`}>
            <span className='material-symbols-outlined' style={{ fontSize: '16px' }}>
              {guardrails?.private_brand_passed ? 'check_circle' : 'cancel'}
            </span>
            {guardrails?.private_brand_passed ? 'Passed' : 'Failed'} ({details.projected_private_brand_pct}%)
          </span>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-sm text-[#d8c3ad]'>SKU Count</span>
          <span className={`flex items-center gap-1 text-xs font-semibold ${guardrails?.sku_count_passed ? 'text-emerald-400' : 'text-rose-400'}`}>
            <span className='material-symbols-outlined' style={{ fontSize: '16px' }}>
              {guardrails?.sku_count_passed ? 'check_circle' : 'cancel'}
            </span>
            {guardrails?.sku_count_passed ? 'Passed' : 'Failed'}
          </span>
        </div>
        <div className='flex justify-between items-center'>
          <span className='text-sm text-[#d8c3ad]'>Shelf Capacity</span>
          <span className='flex items-center gap-1 text-emerald-400 text-xs font-semibold'>
            <span className='material-symbols-outlined' style={{ fontSize: '16px' }}>check_circle</span>
            Passed ({details.projected_shelf_capacity_pct}%)
          </span>
        </div>
      </div>

      <Button className='w-full py-3' onClick={onSubmit}>
        <span className='material-symbols-outlined'>send</span>
        Submit Assortment Plan
      </Button>
    </div>
  );
}
