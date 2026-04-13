
import React from 'react';

const SideNav = () => {
  return (
    <aside className='bg-slate-100 dark:bg-slate-900 flex flex-col fixed left-0 top-18 h-full border-r border-slate-200/10 w-64 pt-8'>
      <div className='px-6 mb-10'>
        <div className='flex items-center gap-3 mb-2'>
          <div className='w-8 h-8 bg-primary rounded flex items-center justify-center text-on-primary font-bold'>L</div>
          <span className='font-bold text-blue-900 dark:text-blue-50 font-headline uppercase tracking-widest text-xs'>Ledger Admin</span>
        </div>
        <span className='font-manrope uppercase tracking-widest text-[10px] text-slate-500'>Level 4 Clearance</span>
      </div>
      <nav className='flex-1 px-4 space-y-2'>
        <div className='text-[10px] font-headline uppercase tracking-[0.2em] text-slate-400 px-4 mb-4'>Main Navigation</div>
        <a className='flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-500 hover:text-blue-700 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all font-manrope uppercase tracking-widest text-[10px]' href='#'>
          <span className='material-symbols-outlined text-lg'>dashboard</span> Overview
        </a>
        <a className='flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-800 text-blue-900 dark:text-blue-100 font-bold rounded-l-lg shadow-sm font-manrope uppercase tracking-widest text-[10px] translate-x-1 duration-200' href='#'>
          <span className='material-symbols-outlined text-lg' style={{fontVariationSettings: '\'FILL\' 1'}}>person_search</span> Individual KYC
        </a>
        <a className='flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-500 hover:text-blue-700 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all font-manrope uppercase tracking-widest text-[10px]' href='#'>
          <span className='material-symbols-outlined text-lg'>domain</span> Corporate KYC
        </a>
        <a className='flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-500 hover:text-blue-700 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all font-manrope uppercase tracking-widest text-[10px]' href='#'>
          <span className='material-symbols-outlined text-lg'>security</span> Risk Engine
        </a>
        <a className='flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-500 hover:text-blue-700 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all font-manrope uppercase tracking-widest text-[10px]' href='#'>
          <span className='material-symbols-outlined text-lg'>inventory_2</span> Archived
        </a>
      </nav>
      <div className='p-4 border-t border-slate-200/10 space-y-2 mb-20'>
        <a className='flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-blue-700 font-manrope uppercase tracking-widest text-[10px]' href='#'>
          <span className='material-symbols-outlined text-lg'>help</span> Support
        </a>
        <a className='flex items-center gap-3 px-4 py-2 text-slate-500 hover:text-blue-700 font-manrope uppercase tracking-widest text-[10px]' href='#'>
          <span className='material-symbols-outlined text-lg'>logout</span> Sign Out
        </a>
      </div>
    </aside>
  );
};

export default SideNav;
