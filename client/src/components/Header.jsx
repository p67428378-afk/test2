import React from 'react';

const Header = () => {
  return (
    <header className='fixed top-0 right-0 left-[240px] h-16 bg-surface/80 dark:bg-surface/80 backdrop-blur-md flex justify-between items-center px-gutter z-50 border-b border-outline-variant dark:border-outline shadow-sm'>
      <h1 className='font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim'>Influencer Dashboard</h1>
      <div className='flex items-center gap-xl'>
        <div className='relative w-72'>
          <span className='material-icons absolute left-3 top-1/2 -translate-y-1/2 text-outline'>search</span>
          <input className='w-full bg-surface-container-low border-none rounded-full pl-10 pr-4 py-2 text-label-md focus:ring-2 focus:ring-primary/20' placeholder='Search data...' type='text'/>
        </div>
        <div className='flex items-center gap-md'>
          <button className='relative p-2 text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-full active:scale-95 duration-100'>
            <span className='material-icons'>notifications</span>
            <span className='absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface'></span>
          </button>
          <div className='h-8 w-[1px] bg-outline-variant'></div>
          <div className='flex items-center gap-sm'>
            <span className='font-label-md text-label-md text-on-surface font-semibold'>Jane Doe</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
