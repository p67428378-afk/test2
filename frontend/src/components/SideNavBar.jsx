import React from 'react';

const SideNavBar = () => {
  return (
    <aside className='fixed left-0 top-16 h-full w-64 bg-slate-100 dark:bg-slate-900 flex flex-col py-8 px-4 gap-2 z-40'>
      <div className='mb-8 px-4'>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white'>
            <span className='material-symbols-outlined'>verified_user</span>
          </div>
          <div>
            <h3 className='font-manrope font-extrabold text-blue-900 dark:text-blue-50 text-sm'>Compliance Terminal</h3>
            <p className='text-[10px] text-slate-500 uppercase tracking-widest'>Institutional Access</p>
          </div>
        </div>
      </div>
      <nav className='flex-1 space-y-1'>
        <a className='text-slate-600 dark:text-slate-400 px-4 py-3 flex items-center gap-3 hover:bg-slate-200 dark:hover:bg-slate-800/50 transition-all active:scale-95 duration-150' href='#'>
          <span className='material-symbols-outlined'>terminal</span>
          <span className='font-inter text-sm font-medium tracking-wide uppercase'>Terminal</span>
        </a>
        <a className='bg-white dark:bg-slate-800 text-blue-900 dark:text-blue-100 rounded-lg shadow-sm px-4 py-3 flex items-center gap-3 transition-all active:scale-95 duration-150' href='#'>
          <span className='material-symbols-outlined'>verified_user</span>
          <span className='font-inter text-sm font-medium tracking-wide uppercase'>Verifications</span>
        </a>
        <a className='text-slate-600 dark:text-slate-400 px-4 py-3 flex items-center gap-3 hover:bg-slate-200 dark:hover:bg-slate-800/50 transition-all active:scale-95 duration-150' href='#'>
          <span className='material-symbols-outlined'>history_edu</span>
          <span className='font-inter text-sm font-medium tracking-wide uppercase'>Audit Logs</span>
        </a>
        <a className='text-slate-600 dark:text-slate-400 px-4 py-3 flex items-center gap-3 hover:bg-slate-200 dark:hover:bg-slate-800/50 transition-all active:scale-95 duration-150' href='#'>
          <span className='material-symbols-outlined'>query_stats</span>
          <span className='font-inter text-sm font-medium tracking-wide uppercase'>Risk Models</span>
        </a>
        <a className='text-slate-600 dark:text-slate-400 px-4 py-3 flex items-center gap-3 hover:bg-slate-200 dark:hover:bg-slate-800/50 transition-all active:scale-95 duration-150' href='#'>
          <span className='material-symbols-outlined'>account_balance</span>
          <span className='font-inter text-sm font-medium tracking-wide uppercase'>Institutions</span>
        </a>
      </nav>
      <div className='mt-auto pt-6 border-t border-slate-200 dark:border-slate-800 space-y-1'>
        <a className='text-slate-500 px-4 py-2 flex items-center gap-3 text-xs uppercase tracking-wider font-semibold hover:text-primary' href='#'>
          <span className='material-symbols-outlined text-sm'>cloud_done</span>
          System Status
        </a>
        <a className='text-slate-500 px-4 py-2 flex items-center gap-3 text-xs uppercase tracking-wider font-semibold hover:text-primary' href='#'>
          <span className='material-symbols-outlined text-sm'>support_agent</span>
          Help Desk
        </a>
        <div className='mt-4 px-4'>
          <button className='w-full bg-gradient-primary text-white font-manrope font-bold py-3 rounded-xl shadow-lg shadow-primary/20 text-xs uppercase tracking-widest active:scale-95 transition-all'>
            New Verification
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SideNavBar;
