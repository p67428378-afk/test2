import React from 'react';

const ApplicationJourney = () => {
  return (
    <div className='col-span-12 lg:col-span-3'>
      <div className='sticky top-32 space-y-12'>
        <div className='space-y-2'>
          <h2 className='text-2xl font-headline font-bold text-primary'>Application Journey</h2>
          <p className='text-sm text-on-surface-variant leading-relaxed'>Please complete the architectural assessment for your credit line eligibility.</p>
        </div>
        <div className='space-y-8 relative'>
          <div className='absolute left-[7px] top-2 bottom-2 w-0.5 bg-outline-variant/30'></div>
          <div className='relative pl-8'>
            <div className='absolute left-0 top-1 w-4 h-4 rounded-full bg-primary ring-4 ring-primary/20'></div>
            <p className='text-xs font-bold uppercase text-primary tracking-tighter'>Step 01</p>
            <p className='text-lg font-headline font-bold text-primary leading-none mt-1'>Personal Details</p>
          </div>
          <div className='relative pl-8'>
            <div className='absolute left-0 top-1 w-4 h-4 rounded-full bg-outline-variant'></div>
            <p className='text-xs font-bold uppercase text-on-surface-variant/40 tracking-tighter'>Step 02</p>
            <p className='text-lg font-headline font-semibold text-on-surface-variant/40 leading-none mt-1'>Financial Status</p>
          </div>
          <div className='relative pl-8'>
            <div className='absolute left-0 top-1 w-4 h-4 rounded-full bg-outline-variant'></div>
            <p className='text-xs font-bold uppercase text-on-surface-variant/40 tracking-tighter'>Step 03</p>
            <p className='text-lg font-headline font-semibold text-on-surface-variant/40 leading-none mt-1'>Employment</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationJourney;
