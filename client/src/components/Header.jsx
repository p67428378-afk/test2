import React from 'react';

const Header = () => {
  return (
    <header className='bg-surface-container-lowest dark:bg-surface-dim shadow-sm docked full-width top-0 z-50'>
      <div className='flex justify-between items-center w-full px-lg py-sm max-w-container-max mx-auto'>
        <div className='font-headline-md text-headline-md font-bold text-primary dark:text-inverse-primary'>
          AutoGuard Calc
        </div>
        <nav className='hidden md:flex items-center gap-md'>
          <a className='font-body-md text-body-md text-on-surface-variant dark:text-outline hover:text-primary-container transition-colors' href='#'>How it Works</a>
          <a className='font-body-md text-body-md text-on-surface-variant dark:text-outline hover:text-primary-container transition-colors' href='#'>Support</a>
          <button className='bg-primary text-on-primary px-md py-xs rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity'>
            Sign In
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
