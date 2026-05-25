import React from 'react';

const StressTestScenarios = () => {
  return (
    <div className='col-span-12 lg:col-span-6 bg-surface-container-low p-8 flex flex-col justify-between'>
      <div className='space-y-6'>
        <div className='flex justify-between items-center'>
          <h3 className='text-xl font-bold font-headline'>Stress Test Scenarios</h3>
          <div className='relative'>
            <select className='appearance-none bg-surface-container-lowest border-none px-4 py-2 pr-10 text-sm font-semibold rounded cursor-pointer ring-1 ring-outline-variant/10'>
              <option>Global Market Crash (-20%)</option>
              <option>Interest Rate Spike (+200bps)</option>
              <option>Oil Price Surge (+50%)</option>
            </select>
            <span className='material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant'>expand_more</span>
          </div>
        </div>
        <div className='bg-surface-container-highest p-6 rounded-lg border-l-4 border-error'>
          <div className='flex items-center gap-4'>
            <div className='bg-error-container p-3 rounded-full'>
              <span className='material-symbols-outlined text-on-error-container'>warning</span>
            </div>
            <div>
              <div className='text-xs font-bold text-on-surface-variant uppercase tracking-widest'>Projected Impact</div>
              <div className='text-3xl font-extrabold text-error'>-$14.8M</div>
              <div className='text-sm text-on-surface-variant mt-1'>Estimated portfolio value: $72.4M (-16.9%)</div>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-8 space-y-4'>
        <div className='text-xs font-bold text-on-surface-variant uppercase'>Affected Asset Classes</div>
        <div className='flex flex-wrap gap-2'>
          <span className='px-3 py-1 bg-surface-container-high rounded text-xs font-semibold'>Equities (-22%)</span>
          <span className='px-3 py-1 bg-surface-container-high rounded text-xs font-semibold'>Emerging Markets (-31%)</span>
          <span className='px-3 py-1 bg-surface-container-high rounded text-xs font-semibold'>Commodities (+4%)</span>
        </div>
      </div>
    </div>
  );
};

export default StressTestScenarios;
