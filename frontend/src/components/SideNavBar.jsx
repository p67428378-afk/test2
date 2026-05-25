import React from 'react';

const SideNavBar = () => {
  return (
    <aside className='fixed left-0 top-0 h-full flex flex-col py-6 bg-slate-200 dark:bg-slate-800 h-screen w-64 border-r-0 z-50'>
      <div className='px-6 mb-8 flex items-center gap-3'>
        <div className='w-10 h-10 bg-primary-container rounded flex items-center justify-center text-on-primary'>
          <span className='material-symbols-outlined' style={{ fontVariationSettings: '\'FILL\' 1' }}>account_balance</span>
        </div>
        <div>
          <div className='text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100'>Sovereign Ledger</div>
          <div className='text-[10px] uppercase tracking-widest text-slate-500 font-bold'>Financial Custodian</div>
        </div>
      </div>
      <nav className='flex-1 px-4 space-y-1'>
        <a className='flex items-center gap-3 px-4 py-3 text-blue-700 dark:text-blue-400 font-bold bg-slate-100 dark:bg-slate-900 rounded-l-lg transition-colors' href='#'>
          <span className='material-symbols-outlined'>dashboard</span>
          <span className='text-[14px]'>Overview</span>
        </a>
        <a className='flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors' href='#'>
          <span className='material-symbols-outlined'>calendar_month</span>
          <span className='text-[14px]'>Schedules</span>
        </a>
        <a className='flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors' href='#'>
          <span className='material-symbols-outlined'>payments</span>
          <span className='text-[14px]'>Transactions</span>
        </a>
        <a className='flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors' href='#'>
          <span className='material-symbols-outlined'>history_edu</span>
          <span className='text-[14px]'>Audit</span>
        </a>
        <a className='flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors' href='#'>
          <span className='material-symbols-outlined'>verified_user</span>
          <span className='text-[14px]'>Compliance</span>
        </a>
        <a className='flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors' href='#'>
          <span className='material-symbols-outlined'>settings_suggest</span>
          <span className='text-[14px]'>System</span>
        </a>
      </nav>
      <div className='px-4 mt-auto'>
        <button className='w-full primary-gradient text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all'>
          <span className='material-symbols-outlined text-[18px]'>add_chart</span>
          Generate Report
        </button>
      </div>
    </aside>
  );
};

export default SideNavBar;
