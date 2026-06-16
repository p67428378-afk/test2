import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className='hidden md:flex flex-col h-full py-6 px-4 gap-y-2 bg-surface-dim border-r border-outline-variant w-sidebar-width shrink-0 z-40'>
      <div className='px-2 mb-6'>
        <p className='font-headline-sm text-headline-sm text-on-surface'>Station Alpha-1</p>
        <p className='font-label-md text-label-md text-on-surface-variant opacity-70'>High-Altitude Monitoring</p>
      </div>
      <nav className='flex-1 flex flex-col gap-1'>
        <NavLink to='/' className={({ isActive }) => 
          `flex items-center gap-3 py-3 px-3 transition-all duration-150 rounded-r-lg ${isActive ? 'text-primary bg-primary-container/10 border-l-2 border-primary font-bold' : 'text-on-surface-variant opacity-80 hover:bg-surface-container-high hover:text-on-surface'}`}>
          <span className='material-symbols-outlined'>dashboard</span>
          <span className='font-label-md text-label-md'>Dashboard</span>
        </NavLink>
        <NavLink to='/forecasts' className={({ isActive }) => 
          `flex items-center gap-3 py-3 px-3 transition-all duration-150 rounded-lg group ${isActive ? 'text-primary bg-primary-container/10 border-l-2 border-primary font-bold' : 'text-on-surface-variant opacity-80 hover:bg-surface-container-high hover:text-on-surface'}`}>
          <span className='material-symbols-outlined group-hover:text-primary'>cloud</span>
          <span className='font-label-md text-label-md'>Forecasts</span>
        </NavLink>
        <NavLink to='/warnings' className={({ isActive }) => 
          `flex items-center gap-3 py-3 px-3 transition-all duration-150 rounded-lg group ${isActive ? 'text-primary bg-primary-container/10 border-l-2 border-primary font-bold' : 'text-on-surface-variant opacity-80 hover:bg-surface-container-high hover:text-on-surface'}`}>
          <span className='material-symbols-outlined group-hover:text-tertiary'>warning</span>
          <span className='font-label-md text-label-md'>Warnings</span>
          <span className='ml-auto bg-error/20 text-error text-[10px] px-1.5 py-0.5 rounded font-mono-data'>3</span>
        </NavLink>
        <NavLink to='/products' className={({ isActive }) => 
          `flex items-center gap-3 py-3 px-3 transition-all duration-150 rounded-lg group ${isActive ? 'text-primary bg-primary-container/10 border-l-2 border-primary font-bold' : 'text-on-surface-variant opacity-80 hover:bg-surface-container-high hover:text-on-surface'}`}>
          <span className='material-symbols-outlined group-hover:text-primary'>grid_view</span>
          <span className='font-label-md text-label-md'>Products</span>
        </NavLink>
        <div className='mt-4 pt-4 border-t border-outline-variant'>
          <NavLink to='/settings' className={({ isActive }) => 
            `flex items-center gap-3 py-3 px-3 transition-all duration-150 rounded-lg group ${isActive ? 'text-primary bg-primary-container/10 border-l-2 border-primary font-bold' : 'text-on-surface-variant opacity-80 hover:bg-surface-container-high hover:text-on-surface'}`}>
            <span className='material-symbols-outlined group-hover:text-primary'>settings</span>
            <span className='font-label-md text-label-md'>Settings</span>
          </NavLink>
        </div>
      </nav>
      <div className='flex flex-col gap-1 mt-auto'>
        <a className='flex items-center gap-3 py-3 px-3 text-on-surface-variant opacity-80 hover:bg-surface-container-high hover:text-on-surface transition-all duration-150 rounded-lg group' href='#'>
          <span className='material-symbols-outlined'>contact_support</span>
          <span className='font-label-md text-label-md'>Support</span>
        </a>
        <a className='flex items-center gap-3 py-3 px-3 text-on-error/80 hover:bg-error-container/20 hover:text-error transition-all duration-150 rounded-lg group' href='#'>
          <span className='material-symbols-outlined'>logout</span>
          <span className='font-label-md text-label-md'>Sign Out</span>
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
