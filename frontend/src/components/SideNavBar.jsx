import React from 'react';

const SideNavBar = () => {
  return (
    <aside className='flex flex-col h-screen fixed left-0 top-0 py-8 px-4 bg-slate-100 dark:bg-slate-900 h-full w-64 border-r-0'>
      <div className='mb-10 px-4'>
        <h1 className='text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50 font-headline'>Sovereign Auditor</h1>
        <p className='text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1'>Portfolio Risk Suite</p>
      </div>
      <nav className='flex-1 space-y-2'>
        <a className='flex items-center gap-3 px-4 py-3 text-slate-900 dark:text-white font-bold border-r-4 border-slate-900 dark:border-slate-50 transition-all duration-200' href='#'>
          <span className='material-symbols-outlined'>dashboard</span>
          <span className='text-sm'>Dashboard</span>
        </a>
        <a className='flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors' href='#'>
          <span className='material-symbols-outlined'>account_balance_wallet</span>
          <span className='text-sm'>Holdings</span>
        </a>
        <a className='flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors' href='#'>
          <span className='material-symbols-outlined'>vitals</span>
          <span className='text-sm'>Stress Tests</span>
        </a>
        <a className='flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors' href='#'>
          <span className='material-symbols-outlined'>gavel</span>
          <span className='text-sm'>Compliance</span>
        </a>
        <a className='flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 font-medium hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors' href='#'>
          <span className='material-symbols-outlined'>published_with_changes</span>
          <span className='text-sm'>Rebalance</span>
        </a>
      </nav>
      <div className='mt-auto px-4 py-6 space-y-4'>
        <button className='w-full py-2.5 px-4 bg-primary text-on-primary font-bold text-sm rounded-lg hover:bg-primary-container transition-all'>
          Generate Report
        </button>
        <div className='pt-6 border-t border-slate-200 dark:border-slate-800 space-y-1'>
          <a className='flex items-center gap-3 px-2 py-2 text-slate-500 dark:text-slate-400 text-xs font-semibold hover:text-slate-900' href='#'>
            <span className='material-symbols-outlined text-lg'>settings</span>
            <span>Settings</span>
          </a>
          <a className='flex items-center gap-3 px-2 py-2 text-slate-500 dark:text-slate-400 text-xs font-semibold hover:text-slate-900' href='#'>
            <span className='material-symbols-outlined text-lg'>contact_support</span>
            <span>Support</span>
          </a>
        </div>
      </div>
    </aside>
  );
};

export default SideNavBar;
