import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <nav className='hidden md:flex flex-col py-6 h-full bg-surface-container border-r border-outline-variant fixed left-0 top-0 bottom-0 w-[260px] z-20'>
      <div className='px-6 mb-8'>
        <h1 className='font-semibold text-lg text-primary-container'>Dollar General</h1>
        <p className='text-xs text-on-surface-variant mt-1'>Category Management</p>
      </div>
      <ul className='flex-1 space-y-2 px-2'>
        <li>
          <NavLink
            to='/'
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-surface-container-highest text-primary-container border-l-2 border-primary-container'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`
            }
          >
            <span className='material-symbols-outlined mr-4 text-lg'>dashboard</span>
            <span className='text-sm font-semibold'>Dashboard</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/scenarios'
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-surface-container-highest text-primary-container border-l-2 border-primary-container'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`
            }
          >
            <span className='material-symbols-outlined mr-4 text-lg'>compare_arrows</span>
            <span className='text-sm font-semibold'>Scenario Comparison</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/approval'
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-surface-container-highest text-primary-container border-l-2 border-primary-container'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`
            }
          >
            <span className='material-symbols-outlined mr-4 text-lg'>fact_check</span>
            <span className='text-sm font-semibold'>Approval Review</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/confirmation'
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-surface-container-highest text-primary-container border-l-2 border-primary-container'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`
            }
          >
            <span className='material-symbols-outlined mr-4 text-lg'>check_circle</span>
            <span className='text-sm font-semibold'>Confirmation</span>
          </NavLink>
        </li>
      </ul>
      <div className='px-6 mt-auto pt-6 border-t border-outline-variant flex items-center'>
        <div className='w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-primary-container font-semibold mr-2'>
          JD
        </div>
        <div>
          <p className='text-sm font-semibold text-on-surface'>John Doe</p>
          <p className='text-xs text-on-surface-variant'>Category Manager</p>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
