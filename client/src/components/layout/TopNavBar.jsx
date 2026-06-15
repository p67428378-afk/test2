import React from 'react';
import { NavLink } from 'react-router-dom';

const TopNavBar = () => {
  return (
    <header className='h-16 w-full flex items-center bg-surface dark:bg-surface border-b border-outline-variant'>
      <div className='flex justify-between items-center px-container-padding w-full max-w-7xl mx-auto'>
        <div className='font-display-result text-[24px] font-bold text-primary dark:text-primary tracking-tight'>
          Simple Calc
        </div>
        <nav className='flex gap-margin-md h-full items-end'>
          <NavLink
            to='/'
            className={({ isActive }) =>
              `font-button-text text-[16px] pb-4 h-full flex items-end transition-colors duration-200 ${
                isActive
                  ? 'text-primary font-bold border-b-2 border-primary'
                  : 'text-on-surface-variant dark:text-on-surface-variant hover:text-on-surface'
              }`
            }
          >
            Calculator
          </NavLink>
          <NavLink
            to='/about'
            className={({ isActive }) =>
              `font-button-text text-[16px] pb-4 h-full flex items-end transition-colors duration-200 ${
                isActive
                  ? 'text-primary font-bold border-b-2 border-primary'
                  : 'text-on-surface-variant dark:text-on-surface-variant hover:text-on-surface'
              }`
            }
          >
            About
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default TopNavBar;
