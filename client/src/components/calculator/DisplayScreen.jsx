import React from 'react';

export default function DisplayScreen({ expression, value }) {
  return (
    <div className='bg-surface-container-low p-lg border-b border-outline-variant/30 flex flex-col items-end justify-end h-32 relative overflow-hidden'>
      {/* Subtle Glow Effect in Display */}
      <div className='absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none'></div>
      <div className='font-label-md text-label-md text-outline mb-sm tracking-widest text-right w-full overflow-hidden whitespace-nowrap overflow-ellipsis min-h-[20px]'>
        {expression || '\u00A0'}
      </div>
      <div
        className='font-display-lg text-display-lg text-on-surface font-bold tracking-tight text-right w-full overflow-hidden whitespace-nowrap overflow-ellipsis'
        id='calc-display-primary'
      >
        {value || '0'}
      </div>
    </div>
  );
}
