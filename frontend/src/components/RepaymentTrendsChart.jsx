import React from 'react';

const RepaymentTrendsChart = () => {
  return (
    <div className='col-span-2 bg-surface-container-low p-6 rounded-xl relative overflow-hidden'>
      <div className='flex justify-between items-center mb-8'>
        <h2 className='text-xl font-extrabold text-primary headline'>Repayment Trends &amp; Penalty Accruals</h2>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <span className='w-3 h-3 rounded-full bg-secondary'></span>
            <span className='text-[11px] font-bold uppercase tracking-wider text-slate-500'>Repayments</span>
          </div>
          <div className='flex items-center gap-2'>
            <span className='w-3 h-3 rounded-full bg-primary-container'></span>
            <span className='text-[11px] font-bold uppercase tracking-wider text-slate-500'>Penalties</span>
          </div>
        </div>
      </div>
      {/* Mock Chart Area */}
      <div className='h-[300px] flex items-end gap-6 relative'>
        <div className='absolute inset-0 flex flex-col justify-between py-2'>
          <div className='w-full border-b border-slate-300 border-dashed h-0'></div>
          <div className='w-full border-b border-slate-300 border-dashed h-0'></div>
          <div className='w-full border-b border-slate-300 border-dashed h-0'></div>
          <div className='w-full border-b border-slate-300 border-dashed h-0'></div>
        </div>
        {/* Chart Bars/Lines (Mockup) */}
        <div className='flex-1 h-full flex flex-col justify-end gap-1'>
          <div className='w-full bg-secondary h-[40%] rounded-t-sm'></div>
          <div className='w-full bg-primary-container h-[10%] rounded-b-sm'></div>
          <div className='text-[10px] text-center mt-2 font-bold text-slate-400'>JAN</div>
        </div>
        <div className='flex-1 h-full flex flex-col justify-end gap-1'>
          <div className='w-full bg-secondary h-[60%] rounded-t-sm'></div>
          <div className='w-full bg-primary-container h-[15%] rounded-b-sm'></div>
          <div className='text-[10px] text-center mt-2 font-bold text-slate-400'>FEB</div>
        </div>
        <div className='flex-1 h-full flex flex-col justify-end gap-1'>
          <div className='w-full bg-secondary h-[55%] rounded-t-sm'></div>
          <div className='w-full bg-primary-container h-[12%] rounded-b-sm'></div>
          <div className='text-[10px] text-center mt-2 font-bold text-slate-400'>MAR</div>
        </div>
        <div className='flex-1 h-full flex flex-col justify-end gap-1'>
          <div className='w-full bg-secondary h-[75%] rounded-t-sm'></div>
          <div className='w-full bg-primary-container h-[18%] rounded-b-sm'></div>
          <div className='text-[10px] text-center mt-2 font-bold text-slate-400'>APR</div>
        </div>
        <div className='flex-1 h-full flex flex-col justify-end gap-1'>
          <div className='w-full bg-secondary h-[85%] rounded-t-sm'></div>
          <div className='w-full bg-primary-container h-[8%] rounded-b-sm'></div>
          <div className='text-[10px] text-center mt-2 font-bold text-slate-400'>MAY</div>
        </div>
        <div className='flex-1 h-full flex flex-col justify-end gap-1'>
          <div className='w-full bg-secondary h-[70%] rounded-t-sm'></div>
          <div className='w-full bg-primary-container h-[20%] rounded-b-sm'></div>
          <div className='text-[10px] text-center mt-2 font-bold text-slate-400'>JUN</div>
        </div>
      </div>
    </div>
  );
};

export default RepaymentTrendsChart;
