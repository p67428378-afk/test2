import React from 'react';

export default function DisplayArea({ expression, value }) {
  return (
    <div className='bg-surface-container-lowest rounded-lg p-padding-display mb-6 border border-outline-variant/50 flex flex-col items-end shadow-inner h-32 justify-end overflow-hidden'>
      <div className='text-on-surface-variant font-body-sm text-body-sm mb-1 min-h-[20px] break-all text-right w-full'>
        {expression}
      </div>
      <div className='font-display-lg text-display-lg text-on-surface break-all text-right w-full select-all'>
        {value}
      </div>
    </div>
  );
}