import React from 'react';

const ValueAtRisk = () => {
  return (
    <div className='col-span-12 lg:col-span-5 bg-primary text-on-primary p-8 flex flex-col justify-between'>
      <div className='space-y-2'>
        <span className='text-xs font-bold text-on-primary-container tracking-widest uppercase'>Value at Risk (VaR)</span>
        <h3 className='text-5xl font-extrabold font-headline'>$4.2M</h3>
        <p className='text-sm text-on-primary-container'>95% Confidence Level • 1-Day Horizon</p>
      </div>
      <div className='mt-8'>
        <div className='flex items-end gap-1 h-24'>
          <div className='bg-primary-fixed-dim/20 w-full h-[40%] rounded-t'></div>
          <div className='bg-primary-fixed-dim/20 w-full h-[60%] rounded-t'></div>
          <div className='bg-primary-fixed-dim/30 w-full h-[55%] rounded-t'></div>
          <div className='bg-primary-fixed-dim/40 w-full h-[75%] rounded-t'></div>
          <div className='bg-primary-fixed-dim/60 w-full h-[90%] rounded-t'></div>
          <div className='bg-primary-fixed-dim/80 w-full h-[85%] rounded-t'></div>
          <div className='bg-on-primary w-full h-[100%] rounded-t'></div>
        </div>
        <div className='flex justify-between mt-2 text-[10px] font-bold text-on-primary-container uppercase'>
          <span>30 Days Ago</span>
          <span>Today</span>
        </div>
      </div>
    </div>
  );
};

export default ValueAtRisk;
