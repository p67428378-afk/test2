
import React from 'react';

const SummaryTable = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-4 gap-gutter mt-xl'>
      <div className='md:col-span-1 bg-primary p-lg rounded-xl text-on-primary flex flex-col justify-between'>
        <div>
          <h3 className='font-headline-md text-headline-md mb-xs'>Optimization</h3>
          <p className='font-body-sm text-body-sm opacity-80'>System-wide efficiency is currently 98.2%</p>
        </div>
        <span className='material-symbols-outlined text-[48px] opacity-20 self-end' data-icon='auto_awesome'>auto_awesome</span>
      </div>
      <div className='md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-md'>
        <div className='bg-surface-container-lowest p-md rounded-xl border border-outline-variant card-shadow flex gap-md items-center'>
          <div className='w-12 h-12 bg-surface-container-low rounded-full flex items-center justify-center shrink-0'>
            <span className='material-symbols-outlined text-primary' data-icon='sensors'>sensors</span>
          </div>
          <div>
            <span className='block font-mono-data text-mono-data text-on-surface'>1,248</span>
            <span className='text-label-bold text-label-bold text-on-surface-variant'>ACTIVE SENSORS</span>
          </div>
        </div>
        <div className='bg-surface-container-lowest p-md rounded-xl border border-outline-variant card-shadow flex gap-md items-center'>
          <div className='w-12 h-12 bg-surface-container-low rounded-full flex items-center justify-center shrink-0'>
            <span className='material-symbols-outlined text-primary' data-icon='thermostat'>thermostat</span>
          </div>
          <div>
            <span className='block font-mono-data text-mono-data text-on-surface'>18.4°C</span>
            <span className='text-label-bold text-label-bold text-on-surface-variant'>AVG WATER TEMP</span>
          </div>
        </div>
        <div className='bg-surface-container-lowest p-md rounded-xl border border-outline-variant card-shadow flex gap-md items-center'>
          <div className='w-12 h-12 bg-surface-container-low rounded-full flex items-center justify-center shrink-0'>
            <span className='material-symbols-outlined text-primary' data-icon='bolt'>bolt</span>
          </div>
          <div>
            <span className='block font-mono-data text-mono-data text-on-surface'>12.5 kWh</span>
            <span className='text-label-bold text-label-bold text-on-surface-variant'>PUMP POWER</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryTable;
