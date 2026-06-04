import React from 'react';

const BaseRateDisplay = () => {
  return (
    <div className='flex items-center justify-between p-sm bg-surface-container-low rounded-lg border border-outline-variant/20'>
      <span className='font-label-md text-label-md text-on-surface-variant'>Base Rate</span>
      <span className='font-headline-md text-headline-md text-on-surface' id='base-rate-display'>$500.00</span>
    </div>
  );
};

export default BaseRateDisplay;
