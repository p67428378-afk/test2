import React from 'react';

const PolicyDetails = () => {
  return (
    <section className='col-span-8 bg-surface-container-lowest rounded-xl p-8 shadow-sm shadow-primary/5 flex flex-col justify-between relative overflow-hidden'>
      <div className='absolute top-0 left-0 w-1.5 h-full bg-primary-fixed-dim'></div>
      <div className='flex justify-between items-start mb-8'>
        <div className='space-y-1'>
          <span className='bg-tertiary-container/10 text-on-tertiary-fixed-variant px-3 py-1 rounded-full text-xs font-bold tracking-wide'>ACTIVE POLICY</span>
          <h2 className='text-3xl font-bold text-primary pt-2'>Premier Gold PPO</h2>
          <p className='text-slate-500 text-sm'>Policy ID: #889-2234-AQC</p>
        </div>
        <div className='text-right'>
          <p className='text-xs font-bold text-slate-400 uppercase tracking-tighter'>Monthly Premium</p>
          <p className='text-4xl font-black text-primary tracking-tight'>$428.50</p>
        </div>
      </div>
      <div className='grid grid-cols-3 gap-8'>
        <div className='bg-surface-container-low p-4 rounded-lg'>
          <span className='text-xs text-slate-500 block mb-1'>Effective Date</span>
          <span className='font-semibold text-teal-900'>January 01, 2023</span>
        </div>
        <div className='bg-surface-container-low p-4 rounded-lg'>
          <span className='text-xs text-slate-500 block mb-1'>Renewal Date</span>
          <span className='font-semibold text-teal-900'>December 31, 2023</span>
        </div>
        <div className='bg-surface-container-low p-4 rounded-lg'>
          <span className='text-xs text-slate-500 block mb-1'>Members Covered</span>
          <span className='font-semibold text-teal-900'>03 (Primary + 2 Dep.)</span>
        </div>
      </div>
    </section>
  );
};

export default PolicyDetails;
