
import React from 'react';

const UsageCharts = () => {
  return (
    <div className='lg:col-span-8 bg-surface-container-lowest p-lg rounded-xl card-shadow border border-outline-variant'>
      <div className='flex justify-between items-center mb-lg'>
        <h2 className='font-headline-md text-headline-md text-primary'>Consumption Trends</h2>
        <div className='flex gap-sm'>
          <button className='px-md py-xs rounded-lg border border-outline-variant font-label-bold text-label-bold hover:bg-surface-container-low'>24h</button>
          <button className='px-md py-xs rounded-lg bg-primary text-on-primary font-label-bold text-label-bold shadow-sm'>7d</button>
          <button className='px-md py-xs rounded-lg border border-outline-variant font-label-bold text-label-bold hover:bg-surface-container-low'>30d</button>
        </div>
      </div>
      <div className='w-full aspect-[16/7] relative overflow-hidden bg-surface-container-low rounded-lg p-md'>
        {/* Chart Mockup */}
        <div className='absolute inset-x-md inset-y-lg flex flex-col justify-between opacity-30'>
          <div className='border-b border-outline'></div>
          <div className='border-b border-outline'></div>
          <div className='border-b border-outline'></div>
          <div className='border-b border-outline'></div>
        </div>
        <svg className='w-full h-full relative z-10' preserveAspectRatio='none' viewBox='0 0 1000 300'>
          <path d='M0,250 Q100,240 200,200 T400,180 T600,220 T800,120 T1000,140' fill='none' stroke='#004655' strokeLinecap='round' strokeWidth='3'></path>
          <path d='M0,200 Q150,190 300,180 T600,175 T1000,170' fill='none' stroke='#00696c' strokeDasharray='8 4' strokeLinecap='round' strokeWidth='3'></path>
        </svg>
        <div className='absolute bottom-md left-md right-md flex justify-between font-mono-data text-mono-data text-on-surface-variant opacity-60'>
          <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
        </div>
      </div>
      <div className='mt-lg flex gap-lg'>
        <div className='flex items-center gap-xs'>
          <div className='w-3 h-3 rounded-full bg-primary'></div>
          <span className='font-body-sm text-body-sm text-on-surface-variant'>Actual Flow</span>
        </div>
        <div className='flex items-center gap-xs'>
          <div className='w-3 h-3 rounded-full bg-secondary'></div>
          <span className='font-body-sm text-body-sm text-on-surface-variant'>Baseline Target</span>
        </div>
      </div>
    </div>
  );
};

export default UsageCharts;
