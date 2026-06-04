import React from 'react';

const TimeSlider = () => {
  return (
    <div className='absolute bottom-margin-desktop left-1/2 -translate-x-1/2 z-30 w-1/3 max-w-lg'>
      <div className='bg-surface-container/90 backdrop-blur-xl border border-outline-variant px-6 py-3 rounded-full shadow-2xl flex items-center gap-6'>
        <button className='text-primary hover:scale-110 transition-transform flex shrink-0'>
          <span className='material-symbols-outlined text-[32px]' style={{fontVariationSettings: '\'FILL\' 1'}}>play_circle</span>
        </button>
        <div className='flex-1 flex flex-col gap-1'>
          <div className='flex justify-between font-mono-data text-[10px] text-on-surface-variant uppercase tracking-tighter'>
            <span>17:00</span>
            <span className='text-primary font-bold'>18:30 UTC</span>
            <span>20:00</span>
          </div>
          <div className='relative h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden'>
            <div className='absolute top-0 left-0 h-full w-[60%] bg-primary'></div>
            <div className='absolute top-0 left-[60%] -ml-1.5 w-3 h-3 bg-on-primary-container rounded-full border-2 border-primary -mt-[3px]'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeSlider;
