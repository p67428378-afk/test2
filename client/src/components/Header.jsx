import React from 'react';

const Header = () => {
  return (
    <header className='bg-surface dark:bg-on-background shadow-sm sticky top-0 z-50'>
      <div className='flex justify-between items-center w-full px-margin-x py-4 max-w-container-max-width mx-auto'>
        <h1 className='font-headline-md text-headline-md font-semibold text-primary dark:text-primary-fixed'>My Todo List</h1>
        <div className='flex items-center gap-4'>
          <button className='material-symbols-outlined text-on-surface-variant dark:text-outline-variant hover:text-primary transition-colors' data-icon='settings'>
            settings
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
