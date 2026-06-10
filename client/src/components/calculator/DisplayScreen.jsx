import React from 'react';

export default function DisplayScreen({ expression, value }) {
  return (
    <div className='bg-surface-container-lowest border border-outline-variant rounded-lg p-6 mb-6 flex flex-col items-end justify-end h-32 shadow-inner overflow-hidden'>
      <div className='font-history-entry text-history-entry text-on-surface-variant mb-2 truncate max-w-full' data-testid='display-expression'>
        {expression || '\u00A0'}
      </div>
      <div className='font-display-result text-display-result text-on-surface truncate max-w-full' data-testid='display-value'>
        {value}
      </div>
    </div>
  );
}