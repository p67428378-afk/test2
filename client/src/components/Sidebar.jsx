import React from 'react';

const Sidebar = () => {
  return (
    <aside className='w-[280px] h-screen fixed left-0 top-0 z-50 bg-surface-container-lowest dark:bg-surface-container border-r border-outline-variant flex flex-col py-stack_lg space-y-base shadow-md'>
      <div className='px-6 mb-8'>
        <h1 className='font-display-lg text-display-lg text-primary'>InsureGuard</h1>
        <p className='font-label-caps text-label-caps text-on-surface-variant'>Enterprise Management</p>
      </div>
      <nav className='flex-1 space-y-1'>
        <a className='flex items-center gap-4 bg-primary-container text-on-primary-container rounded-r-full mr-4 py-3 px-6 border-l-4 border-primary cursor-pointer active:bg-secondary-container transition-all duration-200' href='#'>
          <span className='material-symbols-outlined' data-icon='dashboard'>dashboard</span>
          <span className='font-body-md text-body-md'>Dashboard</span>
        </a>
        <a className='flex items-center gap-4 text-on-surface-variant py-3 px-6 hover:bg-surface-container-high hover:text-primary transition-all duration-200 cursor-pointer active:bg-secondary-container' href='#'>
          <span className='material-symbols-outlined' data-icon='description'>description</span>
          <span className='font-body-md text-body-md'>Policies</span>
        </a>
        <a className='flex items-center gap-4 text-on-surface-variant py-3 px-6 hover:bg-surface-container-high hover:text-primary transition-all duration-200 cursor-pointer active:bg-secondary-container' href='#'>
          <span className='material-symbols-outlined' data-icon='group'>group</span>
          <span className='font-body-md text-body-md'>Customers</span>
        </a>
        <a className='flex items-center gap-4 text-on-surface-variant py-3 px-6 hover:bg-surface-container-high hover:text-primary transition-all duration-200 cursor-pointer active:bg-secondary-container' href='#'>
          <span className='material-symbols-outlined' data-icon='settings'>settings</span>
          <span className='font-body-md text-body-md'>Settings</span>
        </a>
      </nav>
      <div className='px-6 pt-4 border-t border-outline-variant'>
        <div className='flex items-center gap-3 p-2 rounded-lg bg-surface-container'>
          <div className='w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-on-primary-fixed font-bold'>
            IG
          </div>
          <div>
            <p className='text-title-sm font-title-sm'>Admin Portal</p>
            <p className='text-body-sm font-body-sm text-on-surface-variant'>v2.4.0-stable</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
