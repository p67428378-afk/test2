import React from 'react';

const Header = () => {
  return (
    <header className='flex justify-between items-center h-16 px-margin-desktop w-full z-50 bg-surface-container border-b border-outline-variant fixed top-0 left-0 right-0'>
      <div className='flex items-center gap-4'>
        <img alt='METEOROS' className='w-10 h-10' src='data:image/png;base64,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' />
        <h1 className='font-display-lg text-[22px] font-bold text-primary tracking-tight'>METEOROS</h1>
      </div>
      <div className='hidden md:flex items-center gap-6'>
        <h2 className='font-title-lg text-title-lg text-on-surface opacity-80 uppercase tracking-widest text-sm'>Weather Management System</h2>
      </div>
      <div className='flex items-center gap-4'>
        <div className='relative group'>
          <button className='p-2 hover:bg-surface-container-high rounded-full transition-colors duration-200'>
            <span className='material-symbols-outlined text-primary'>notifications</span>
            <span className='absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface-container'></span>
          </button>
        </div>
        <button className='p-2 hover:bg-surface-container-high rounded-full transition-colors duration-200'>
          <span className='material-symbols-outlined text-on-surface-variant'>help_outline</span>
        </button>
        <div className='flex items-center gap-3 pl-4 border-l border-outline-variant'>
          <div className='text-right hidden sm:block'>
            <p className='font-label-md text-label-md text-on-surface'>Chief Forecaster</p>
            <p className='text-[10px] text-on-surface-variant font-mono-data opacity-60'>STATION ALPHA-1</p>
          </div>
          <button className='p-0.5 rounded-full border-2 border-primary-container'>
            <span className='material-symbols-outlined text-on-surface-variant text-[32px]' style={{fontVariationSettings: '\'FILL\' 1'}}>account_circle</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
