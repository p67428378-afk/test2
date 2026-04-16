import React from 'react';

const SideNav = () => {
  return (
    <aside className='h-screen w-64 bg-slate-50 dark:bg-slate-950 flex flex-col py-6 transition-all duration-300 ease-out font-inter text-sm antialiased'>
      <div className='px-6 mb-8'>
        <div className='flex flex-col gap-1'>
          <span className='font-manrope font-black text-teal-900 dark:text-teal-100 text-lg'>Julian Reed</span>
          <span className='text-xs text-slate-500 uppercase tracking-widest'>Premium Member</span>
        </div>
      </div>
      <nav className='flex-1 space-y-1'>
        <a className='flex items-center gap-3 text-teal-900 dark:text-teal-50 font-semibold border-l-4 border-teal-600 pl-4 py-3 hover:bg-white/50 transition-all' href='#'>
          <span className='material-symbols-outlined' style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span>Overview</span>
        </a>
        <a className='flex items-center gap-3 text-slate-600 dark:text-slate-400 pl-5 py-3 hover:text-teal-700 hover:bg-white/50 transition-all' href='#'>
          <span className='material-symbols-outlined'>verified_user</span>
          <span>My Policies</span>
        </a>
        <a className='flex items-center gap-3 text-slate-600 dark:text-slate-400 pl-5 py-3 hover:text-teal-700 hover:bg-white/50 transition-all' href='#'>
          <span className='material-symbols-outlined'>receipt_long</span>
          <span>Claims</span>
        </a>
        <a className='flex items-center gap-3 text-slate-600 dark:text-slate-400 pl-5 py-3 hover:text-teal-700 hover:bg-white/50 transition-all' href='#'>
          <span className='material-symbols-outlined'>local_hospital</span>
          <span>Providers</span>
        </a>
        <a className='flex items-center gap-3 text-slate-600 dark:text-slate-400 pl-5 py-3 hover:text-teal-700 hover:bg-white/50 transition-all' href='#'>
          <span className='material-symbols-outlined'>folder_open</span>
          <span>Documents</span>
        </a>
      </nav>
      <div className='px-5 mb-6'>
        <button className='w-full py-3 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-semibold shadow-lg shadow-primary/20 flex items-center justify-center gap-2'>
          <span className='material-symbols-outlined text-sm'>add</span>
          <span>New Claim</span>
        </button>
      </div>
      <div className='pt-6 border-t border-slate-200 dark:border-slate-800 space-y-1'>
        <a className='flex items-center gap-3 text-slate-600 dark:text-slate-400 pl-5 py-3 hover:text-teal-700 transition-all' href='#'>
          <span className='material-symbols-outlined'>settings</span>
          <span>Settings</span>
        </a>
        <a className='flex items-center gap-3 text-slate-600 dark:text-slate-400 pl-5 py-3 hover:text-teal-700 transition-all' href='#'>
          <span className='material-symbols-outlined'>logout</span>
          <span>Sign Out</span>
        </a>
      </div>
    </aside>
  );
};

export default SideNav;
