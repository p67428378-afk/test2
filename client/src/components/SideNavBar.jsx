
import React from 'react';

const SideNavBar = () => {
  return (
    <aside className='hidden md:flex flex-col h-[calc(100vh-64px)] w-64 fixed left-0 top-16 bg-surface-container-low dark:bg-surface-container-high border-r border-outline-variant dark:border-outline p-md gap-lg z-40'>
      <div className='flex flex-col gap-xs mb-md'>
        <span className='text-label-bold font-label-bold text-on-surface-variant uppercase tracking-wider'>Navigation</span>
        <nav className='flex flex-col gap-sm'>
          <a href='#' className='flex items-center gap-md bg-secondary-container dark:bg-primary-container text-on-secondary-container dark:text-on-primary-container rounded-lg px-md py-sm transition-all scale-98 active:scale-95 duration-200'>
            <span className='material-symbols-outlined' data-icon='dashboard'>dashboard</span>
            <span className='font-label-bold text-label-bold'>Dashboard</span>
          </a>
          <a href='#' className='flex items-center gap-md text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-highest dark:hover:bg-surface-dim transition-all px-md py-sm rounded-lg scale-98 active:scale-95 duration-200'>
            <span className='material-symbols-outlined' data-icon='analytics'>analytics</span>
            <span className='font-label-bold text-label-bold'>Reporting</span>
          </a>
          <a href='#' className='flex items-center gap-md text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-highest dark:hover:bg-surface-dim transition-all px-md py-sm rounded-lg scale-98 active:scale-95 duration-200'>
            <span className='material-symbols-outlined' data-icon='settings'>settings</span>
            <span className='font-label-bold text-label-bold'>Settings</span>
          </a>
          <a href='#' className='flex items-center gap-md text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-highest dark:hover:bg-surface-dim transition-all px-md py-sm rounded-lg scale-98 active:scale-95 duration-200'>
            <span className='material-symbols-outlined' data-icon='person'>person</span>
            <span className='font-label-bold text-label-bold'>Profile</span>
          </a>
        </nav>
      </div>
      <button className='bg-primary text-on-primary font-label-bold text-label-bold py-md px-lg rounded-xl flex items-center justify-center gap-sm hover:opacity-90 transition-opacity'>
        <span className='material-symbols-outlined' data-icon='add'>add</span>
        Add Sensor
      </button>
      <div className='mt-auto flex flex-col gap-sm'>
        <a href='#' className='flex items-center gap-md text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-highest transition-all px-md py-sm rounded-lg'>
          <span className='material-symbols-outlined' data-icon='support_agent'>support_agent</span>
          <span className='font-label-bold text-label-bold'>Support</span>
        </a>
        <a href='#' className='flex items-center gap-md text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-highest transition-all px-md py-sm rounded-lg'>
          <span className='material-symbols-outlined' data-icon='logout'>logout</span>
          <span className='font-label-bold text-label-bold'>Logout</span>
        </a>
      </div>
    </aside>
  );
};

export default SideNavBar;
