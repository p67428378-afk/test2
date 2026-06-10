import React from 'react';

export default function Header() {
  return (
    <header className='bg-surface-container shadow-sm flex justify-between items-center w-full px-6 py-4 top-0 docked full-width'>
      <div className='flex items-center gap-4'>
        <h1 className='font-display-result-mobile text-display-result-mobile text-primary font-bold'>MathFlow</h1>
        <div className='flex items-center gap-2 px-3 py-1 bg-surface-variant rounded-full border border-outline-variant'>
          <div className='w-2 h-2 rounded-full bg-primary-container animate-pulse'></div>
          <span className='font-label-sm text-label-sm text-on-surface-variant'>API Connected</span>
        </div>
      </div>
      <div className='flex items-center text-primary'>
        <span className='material-symbols-outlined' data-icon='sensors'>sensors</span>
      </div>
    </header>
  );
}