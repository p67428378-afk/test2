import React from 'react';

export default function Header() {
  return (
    <header className='fixed top-0 right-0 h-[64px] w-[calc(100%-260px)] bg-surface border-b border-outline-variant flex justify-between items-center px-lg z-40'>
      <div className='flex items-center gap-md'>
        <h1 className='font-title-sm text-title-sm font-semibold text-on-surface'>SafePipe System Control</h1>
        <div className='h-6 w-[1px] bg-outline-variant'></div>
        <div className='flex items-center gap-sm bg-surface-container-low px-md py-xs rounded-full border border-outline-variant'>
          <span className='material-symbols-outlined text-on-surface-variant' style={{ fontSize: '18px' }}>search</span>
          <input
            className='bg-transparent border-none focus:ring-0 text-body-sm w-64 placeholder-on-surface-variant text-on-surface outline-none'
            placeholder='Search sensors, sectors...'
            type='text'
          />
        </div>
      </div>
      <div className='flex items-center gap-md'>
        <button className='p-sm text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all active:scale-95'>
          <span className='material-symbols-outlined'>notifications</span>
        </button>
        <button className='p-sm text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all active:scale-95'>
          <span className='material-symbols-outlined'>sensors</span>
        </button>
        <div className='flex items-center gap-xs ml-sm'>
          <span className='w-2 h-2 rounded-full bg-green-500 animate-pulse'></span>
          <span className='font-label-mono text-label-mono text-green-500'>SYSTEM LIVE</span>
        </div>
      </div>
    </header>
  );
}
