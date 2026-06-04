import React from 'react';

const Header = () => {
  return (
    <header className='h-16 w-full fixed top-0 z-40 bg-surface border-b border-outline-variant shadow-sm flex items-center justify-between px-margin_desktop lg:ml-[280px] lg:w-[calc(100%-280px)]'>
      <h2 className='font-headline-md text-headline-md text-on-surface'>Vehicle Insurance Premium Calculator</h2>
      <div className='flex items-center gap-4'>
        <div className='hidden md:flex items-center bg-surface-container-low px-4 py-1.5 rounded-full border border-outline-variant'>
          <span className='material-symbols-outlined text-outline text-sm' data-icon='search'>search</span>
          <input className='bg-transparent border-none focus:ring-0 text-body-md w-48' placeholder='Quick search...' type='text' />
        </div>
        <button className='p-2 hover:bg-surface-container-low rounded-full transition-colors active:scale-95 duration-200'>
          <span className='material-symbols-outlined text-on-surface-variant' data-icon='notifications'>notifications</span>
        </button>
        <div className='flex items-center gap-3 pl-4 border-l border-outline-variant cursor-pointer active:scale-95 duration-200'>
          <span className='material-symbols-outlined text-primary text-3xl' data-icon='account_circle'>account_circle</span>
          <span className='hidden sm:block font-label-caps text-label-caps text-on-surface'>J. CARTER</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
