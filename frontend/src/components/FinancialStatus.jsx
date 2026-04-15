import React from 'react';

const FinancialStatus = () => {
  return (
    <div className='bg-surface-container-low p-10 rounded-xl space-y-8'>
      <div className='flex items-center gap-3'>
        <span className='material-symbols-outlined text-primary'>account_balance</span>
        <h3 className='text-xl font-headline font-semibold text-primary'>Financial Status</h3>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-12'>
        <div className='md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8'>
          <div className='space-y-2'>
            <label className='text-xs font-bold uppercase text-on-surface-variant tracking-wider'>Annual Gross Income</label>
            <div className='relative'>
              <span className='absolute left-0 top-2 text-lg font-medium'>$</span>
              <input className='w-full bg-transparent border-0 border-b-2 border-outline-variant/20 focus:border-primary focus:ring-0 pl-4 py-2 text-lg font-medium transition-all' placeholder='185,000' type='number' />
            </div>
          </div>
          <div className='space-y-2'>
            <label className='text-xs font-bold uppercase text-on-surface-variant tracking-wider'>Estimated Credit Score</label>
            <div className='flex items-center gap-4 py-2'>
              <span className='text-3xl font-headline font-bold text-primary'>782</span>
              <span className='px-2 py-0.5 bg-tertiary-container text-on-tertiary-container text-[10px] font-bold rounded'>EXCELLENT</span>
            </div>
          </div>
        </div>
        <div className='md:col-span-1'>
          <div className='border-2 border-dashed border-outline-variant/40 rounded-xl p-6 flex flex-col items-center justify-center text-center space-y-2 hover:bg-white transition-colors cursor-pointer group'>
            <span className='material-symbols-outlined text-3xl text-outline-variant group-hover:text-primary transition-colors'>cloud_upload</span>
            <p className='text-xs font-bold text-on-surface-variant uppercase tracking-tighter'>Upload Statement</p>
            <p className='text-[10px] text-on-surface-variant opacity-60'>PDF or JPEG (Max 10MB)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancialStatus;
