import React from 'react';

export default function TopNavBar() {
  return (
    <header className='bg-surface dark:bg-inverse-surface border-b border-outline-variant dark:border-outline shadow-sm flex justify-between items-center w-full px-margin-desktop h-16 sticky top-0 z-50'>
      <div className='flex items-center gap-4'>
        <div className='bg-primary-container text-on-primary-container font-bold px-3 py-1 rounded text-lg tracking-wider'>
          DG
        </div>
        <h1 className='font-headline-md text-headline-md text-on-surface font-bold ml-2'>
          DG Cluster Assortment Advisor
        </h1>
      </div>
      <div className='flex items-center gap-6'>
        <button className='font-label-bold text-label-bold bg-primary-container text-on-primary-container px-4 py-2 rounded-DEFAULT transition-colors duration-200 ease-in-out hover:bg-surface-container-high dark:hover:bg-surface-variant flex items-center gap-2'>
          <span className='material-symbols-outlined text-[18px]'>download</span>
          Quick Export
        </button>
        <div className='flex items-center gap-4 text-primary dark:text-primary-fixed'>
          <button className='transition-colors duration-200 ease-in-out hover:bg-surface-container-high dark:hover:bg-surface-variant p-2 rounded-full'>
            <span className='material-symbols-outlined'>notifications</span>
          </button>
          <button className='transition-colors duration-200 ease-in-out hover:bg-surface-container-high dark:hover:bg-surface-variant p-2 rounded-full'>
            <span className='material-symbols-outlined'>settings</span>
          </button>
        </div>
        <div className='flex items-center gap-3 border-l border-outline-variant pl-6'>
          <div className='text-right hidden sm:block'>
            <div className='font-body-md text-body-md font-semibold'>John Doe</div>
            <div className='font-label-bold text-label-bold text-secondary'>Category Manager</div>
          </div>
          <div className='w-10 h-10 rounded-full bg-surface-container-highest overflow-hidden flex items-center justify-center text-on-surface font-bold border border-outline-variant'>
            JD
          </div>
        </div>
      </div>
    </header>
  );
}
