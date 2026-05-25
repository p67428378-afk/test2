
import React from 'react';

const Sidebar = () => {
  return (
    <aside className='fixed left-0 top-0 h-screen w-64 border-r-0 bg-slate-50 dark:bg-slate-950 flex flex-col py-8 px-6 z-50'>
      <div className='mb-12'>
        <h1 className='text-2xl font-black text-[#002D72] dark:text-white tracking-widest uppercase'>The Vault</h1>
        <p className='font-manrope tracking-tight text-xs font-semibold uppercase text-slate-500 mt-1'>Private Banking</p>
      </div>
      <nav className='flex-1 space-y-4'>
        <button className='w-full flex items-center space-x-3 px-4 py-3 text-[#002D72] dark:text-blue-300 font-bold border-r-4 border-[#002D72] bg-slate-200/50 dark:bg-blue-900/20 transition-all duration-300'>
          <span className='material-symbols-outlined'>account_balance_wallet</span>
          <span className='font-manrope tracking-tight text-sm font-semibold uppercase'>Portfolio</span>
        </button>
        <button className='w-full flex items-center space-x-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#002D72] dark:hover:text-blue-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all duration-300'>
          <span className='material-symbols-outlined'>receipt_long</span>
          <span className='font-manrope tracking-tight text-sm font-semibold uppercase'>Transactions</span>
        </button>
        <button className='w-full flex items-center space-x-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#002D72] dark:hover:text-blue-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all duration-300'>
          <span className='material-symbols-outlined'>payments</span>
          <span className='font-manrope tracking-tight text-sm font-semibold uppercase'>Payments</span>
        </button>
        <button className='w-full flex items-center space-x-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#002D72] dark:hover:text-blue-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all duration-300'>
          <span className='material-symbols-outlined'>show_chart</span>
          <span className='font-manrope tracking-tight text-sm font-semibold uppercase'>Investments</span>
        </button>
        <button className='w-full flex items-center space-x-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-[#002D72] dark:hover:text-blue-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all duration-300'>
          <span className='material-symbols-outlined'>encrypted</span>
          <span className='font-manrope tracking-tight text-sm font-semibold uppercase'>Security</span>
        </button>
      </nav>
      <div className='mt-auto space-y-6'>
        <button className='w-full bg-[#002D72] text-white font-label font-bold py-4 rounded-xl shadow-lg hover:scale-[0.98] transition-transform active:scale-95'>
          New Transfer
        </button>
        <div className='pt-6 space-y-2 border-t border-slate-200 dark:border-slate-800'>
          <button className='w-full flex items-center space-x-3 px-4 py-2 text-slate-500 hover:text-[#002D72] transition-colors'>
            <span className='material-symbols-outlined'>settings</span>
            <span className='text-sm font-medium uppercase tracking-tight'>Settings</span>
          </button>
          <button className='w-full flex items-center space-x-3 px-4 py-2 text-slate-500 hover:text-[#002D72] transition-colors'>
            <span className='material-symbols-outlined'>contact_support</span>
            <span className='text-sm font-medium uppercase tracking-tight'>Support</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
