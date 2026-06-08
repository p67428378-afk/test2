import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className='fixed left-0 top-0 h-full w-[280px] bg-surface-container-lowest border-r border-outline-variant shadow-sm flex flex-col py-stack-lg px-gutter z-50'>
      <div className='mb-stack-lg'>
        <h1 className='font-h2 text-h2 font-bold text-primary'>SnackMaster</h1>
        <p className='font-body-md text-body-md text-on-surface-variant'>Cook Management Portal</p>
      </div>
      <nav className='flex-grow space-y-1'>
        <NavLink to='/' className={({ isActive }) => isActive ? 'flex items-center gap-3 px-4 py-3 text-primary font-semibold border-r-4 border-primary bg-surface-container-low transition-colors duration-150 active:scale-95' : 'flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors duration-150 active:scale-95'}>
          <span className='material-symbols-outlined' data-icon='dashboard'>dashboard</span>
          <span className='font-body-md text-body-md'>Dashboard</span>
        </NavLink>
        <NavLink to='/snack-inventory' className={({ isActive }) => isActive ? 'flex items-center gap-3 px-4 py-3 text-primary font-semibold border-r-4 border-primary bg-surface-container-low transition-colors duration-150 active:scale-95' : 'flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors duration-150 active:scale-95'}>
          <span className='material-symbols-outlined' data-icon='inventory_2'>inventory_2</span>
          <span className='font-body-md text-body-md'>Snack Inventory</span>
        </NavLink>
        <NavLink to='/request-snack' className={({ isActive }) => isActive ? 'flex items-center gap-3 px-4 py-3 text-primary font-semibold border-r-4 border-primary bg-surface-container-low transition-colors duration-150 active:scale-95' : 'flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors duration-150 active:scale-95'}>
          <span className='material-symbols-outlined' data-icon='add_shopping_cart'>add_shopping_cart</span>
          <span className='font-body-md text-body-md'>Request Snack</span>
        </NavLink>
        <NavLink to='/mark-consumed' className={({ isActive }) => isActive ? 'flex items-center gap-3 px-4 py-3 text-primary font-semibold border-r-4 border-primary bg-surface-container-low transition-colors duration-150 active:scale-95' : 'flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors duration-150 active:scale-95'}>
          <span className='material-symbols-outlined' data-icon='check_circle'>check_circle</span>
          <span className='font-body-md text-body-md'>Mark Consumed</span>
        </NavLink>
        <NavLink to='/expiry-management' className={({ isActive }) => isActive ? 'flex items-center gap-3 px-4 py-3 text-primary font-semibold border-r-4 border-primary bg-surface-container-low transition-colors duration-150 active:scale-95' : 'flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors duration-150 active:scale-95'}>
          <span className='material-symbols-outlined' data-icon='event_busy'>event_busy</span>
          <span className='font-body-md text-body-md'>Expiry Management</span>
        </NavLink>
      </nav>
      <div className='mt-auto pt-6 border-t border-outline-variant'>
        <button className='w-full flex items-center justify-center gap-2 bg-primary text-on-primary py-3 rounded-xl font-label-md text-label-md hover:opacity-90 transition-all active:scale-95'>
          <span className='material-symbols-outlined' data-icon='add'>add</span>
          New Inventory
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
