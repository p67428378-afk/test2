
import React from 'react';

const KeyMetricsCards = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-gutter mb-xl'>
      {/* Current Usage Card */}
      <div className='bg-surface-container-lowest p-lg rounded-xl card-shadow border border-outline-variant flex flex-col gap-md'>
        <div className='flex justify-between items-start'>
          <span className='text-on-surface-variant font-label-bold text-label-bold uppercase tracking-wider'>Current Usage</span>
          <span className='material-symbols-outlined text-primary' data-icon='water_drop'>water_drop</span>
        </div>
        <div className='flex items-baseline gap-xs'>
          <span className='font-display-lg text-display-lg text-primary-container'>4.2</span>
          <span className='font-body-md text-body-md text-on-surface-variant'>kL/hr</span>
        </div>
        <div className='w-full h-12 flex items-end gap-1'>
          {/* Tiny Sparkline Mockup */}
          <div className='flex-1 bg-surface-container-highest rounded-t-sm h-[30%]'></div>
          <div className='flex-1 bg-surface-container-highest rounded-t-sm h-[45%]'></div>
          <div className='flex-1 bg-surface-container-highest rounded-t-sm h-[60%]'></div>
          <div className='flex-1 bg-surface-container-highest rounded-t-sm h-[80%]'></div>
          <div className='flex-1 bg-primary h-[95%] rounded-t-sm'></div>
          <div className='flex-1 bg-primary h-[85%] rounded-t-sm'></div>
          <div className='flex-1 bg-primary h-[90%] rounded-t-sm'></div>
          <div className='flex-1 bg-primary h-[100%] rounded-t-sm'></div>
        </div>
      </div>

      {/* Daily Average Card */}
      <div className='bg-surface-container-lowest p-lg rounded-xl card-shadow border border-outline-variant flex flex-col gap-md'>
        <div className='flex justify-between items-start'>
          <span className='text-on-surface-variant font-label-bold text-label-bold uppercase tracking-wider'>Daily Average</span>
          <span className='material-symbols-outlined text-secondary' data-icon='event'>event</span>
        </div>
        <div className='flex items-baseline gap-xs'>
          <span className='font-display-lg text-display-lg text-on-background'>92.4</span>
          <span className='font-body-md text-body-md text-on-surface-variant'>m³</span>
        </div>
        <div className='flex items-center gap-xs text-secondary font-label-bold text-label-bold bg-secondary-container/20 px-sm py-xs rounded-full w-fit'>
          <span className='material-symbols-outlined text-[16px]' data-icon='trending_down'>trending_down</span>
          <span>12.4% vs last week</span>
        </div>
      </div>

      {/* System Status Card */}
      <div className='bg-surface-container-lowest p-lg rounded-xl card-shadow border border-outline-variant flex flex-col gap-md'>
        <div className='flex justify-between items-start'>
          <span className='text-on-surface-variant font-label-bold text-label-bold uppercase tracking-wider'>System Status</span>
          <span className='material-symbols-outlined text-on-surface-variant' data-icon='security'>security</span>
        </div>
        <div className='flex flex-col gap-sm'>
          <div className='flex items-center gap-md py-sm'>
            <div className='w-10 h-10 rounded-full bg-tertiary-fixed flex items-center justify-center'>
              <span className='material-symbols-outlined text-tertiary' data-icon='check_circle' style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
            </div>
            <div>
              <span className='font-headline-md text-headline-md text-tertiary block'>Secure</span>
              <span className='text-label-bold text-label-bold text-on-surface-variant'>All sensors active</span>
            </div>
          </div>
          <p className='font-body-sm text-body-sm text-on-surface-variant border-t border-outline-variant pt-sm mt-sm'>Next system diagnostic in 4h 12m</p>
        </div>
      </div>
    </div>
  );
};

export default KeyMetricsCards;
