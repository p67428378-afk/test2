import React from 'react';
import { NavLink } from 'react-router-dom';

export default function SidebarNav() {
  return (
    <nav className='bg-slate-800 text-slate-300 font-sans text-sm fixed left-0 top-0 h-full w-[260px] shadow-md transition-all duration-200 ease-in-out flex flex-col py-6 px-4 z-20'>
      <div className='mb-10 px-2 flex items-center gap-3'>
        <div className='w-10 h-10 rounded-lg bg-amber-400 flex items-center justify-center shrink-0'>
          <span className='text-xl text-slate-900 font-black'>DG</span>
        </div>
        <div>
          <h1 className='text-lg text-white font-bold leading-tight'>DG Advisor</h1>
          <p className='text-xs text-slate-400 mt-0.5'>Cluster Assortment</p>
        </div>
      </div>
      <ul className='flex flex-col gap-2 flex-grow'>
        <li>
          <NavLink
            to='/'
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg border-l-4 transition-all duration-200 ease-in-out ${
                isActive
                  ? 'border-amber-400 bg-slate-700 text-white font-bold'
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`
            }
          >
            <span className='material-symbols-outlined text-[20px]'>dashboard</span>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/scenarios'
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg border-l-4 transition-all duration-200 ease-in-out ${
                isActive
                  ? 'border-amber-400 bg-slate-700 text-white font-bold'
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`
            }
          >
            <span className='material-symbols-outlined text-[20px]'>compare_arrows</span>
            Scenario Comparison
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/approval'
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg border-l-4 transition-all duration-200 ease-in-out ${
                isActive
                  ? 'border-amber-400 bg-slate-700 text-white font-bold'
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`
            }
          >
            <span className='material-symbols-outlined text-[20px]'>fact_check</span>
            Approval Review
          </NavLink>
        </li>
        <li>
          <NavLink
            to='/confirmation'
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg border-l-4 transition-all duration-200 ease-in-out ${
                isActive
                  ? 'border-amber-400 bg-slate-700 text-white font-bold'
                  : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`
            }
          >
            <span className='material-symbols-outlined text-[20px]'>check_circle</span>
            Confirmation
          </NavLink>
        </li>
      </ul>
      <div className='mt-auto pt-6 border-t border-slate-700 px-2 flex items-center gap-3'>
        <div className='w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-sm'>
          A
        </div>
        <div className='flex-1 min-w-0'>
          <p className='text-xs text-white truncate'>Administrator</p>
        </div>
      </div>
    </nav>
  );
}
