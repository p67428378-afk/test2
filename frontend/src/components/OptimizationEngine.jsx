import React from 'react';

const OptimizationEngine = () => {
  return (
    <div className='col-span-12 lg:col-span-4 flex flex-col gap-6'>
      <h3 className='text-xl font-bold font-headline'>Optimization Engine</h3>
      <div className='bg-surface-container-high p-8 space-y-6 flex-1 risk-ribbon-success'>
        <div className='space-y-4'>
          <div className='bg-surface-container-lowest p-4 flex justify-between items-center group cursor-pointer hover:shadow-lg transition-all'>
            <div className='flex items-center gap-4'>
              <div className='bg-error-container text-on-error-container p-2 rounded'>
                <span className='material-symbols-outlined text-lg'>trending_down</span>
              </div>
              <div>
                <div className='text-xs font-bold'>Sell RELIANCE</div>
                <div className='text-[10px] text-on-surface-variant'>Sell 2,500 units</div>
              </div>
            </div>
            <div className='text-right'>
              <div className='text-xs font-bold text-primary'>-4 pts</div>
              <div className='text-[10px] text-on-surface-variant'>Risk Impact</div>
            </div>
          </div>
          <div className='bg-surface-container-lowest p-4 flex justify-between items-center group cursor-pointer hover:shadow-lg transition-all'>
            <div className='flex items-center gap-4'>
              <div className='bg-secondary-container text-on-secondary-container p-2 rounded'>
                <span className='material-symbols-outlined text-lg'>trending_up</span>
              </div>
              <div>
                <div className='text-xs font-bold'>Buy GOOGL</div>
                <div className='text-[10px] text-on-surface-variant'>Buy 1,200 units</div>
              </div>
            </div>
            <div className='text-right'>
              <div className='text-xs font-bold text-primary'>-2 pts</div>
              <div className='text-[10px] text-on-surface-variant'>Risk Impact</div>
            </div>
          </div>
          <div className='bg-surface-container-lowest p-4 flex justify-between items-center group cursor-pointer hover:shadow-lg transition-all'>
            <div className='flex items-center gap-4'>
              <div className='bg-secondary-container text-on-secondary-container p-2 rounded'>
                <span className='material-symbols-outlined text-lg'>trending_up</span>
              </div>
              <div>
                <div className='text-xs font-bold'>Buy G-Sec 2030</div>
                <div className='text-[10px] text-on-surface-variant'>Add $250k Hedge</div>
              </div>
            </div>
            <div className='text-right'>
              <div className='text-xs font-bold text-primary'>-8 pts</div>
              <div className='text-[10px] text-on-surface-variant'>Risk Impact</div>
            </div>
          </div>
        </div>
        <div className='pt-6 border-t border-surface-container-highest'>
          <div className='text-[10px] font-bold text-on-surface-variant uppercase mb-2'>Summary Effect</div>
          <div className='flex justify-between items-end'>
            <span className='text-xs font-medium'>New Risk Score</span>
            <span className='text-2xl font-bold text-primary'>51 / 100</span>
          </div>
          <button className='w-full mt-6 py-3 bg-primary text-on-primary text-sm font-bold hover:bg-primary-container transition-all'>Execute All Recommendations</button>
        </div>
      </div>
    </div>
  );
};

export default OptimizationEngine;
