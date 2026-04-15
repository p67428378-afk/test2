import React from 'react';

const Header = () => {
  return (
    <header className="fixed top-0 right-0 left-64 h-20 px-12 flex items-center justify-between z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm dark:shadow-none font-['Manrope'] font-semibold">
      <div className="flex items-center gap-8">
        <h2 className="text-2xl font-extrabold text-[#003345] dark:text-white tracking-tighter">New Application</h2>
        <div className="hidden md:flex items-center bg-surface-container-low px-4 py-2 rounded-full border border-outline-variant/10">
          <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
          <input className="bg-transparent border-none focus:ring-0 text-sm w-64 placeholder:text-slate-400" placeholder="Search services..." type="text" />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <button className="relative text-slate-500 hover:text-[#004B63] transition-opacity">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full"></span>
        </button>
        <button className="text-slate-500 hover:text-[#004B63] transition-opacity">
          <span className="material-symbols-outlined">account_balance_wallet</span>
        </button>
        <div className="h-8 w-[1px] bg-outline-variant/20 mx-2"></div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-on-surface-variant">Status: <span className="text-primary font-bold">Premium Tier</span></span>
        </div>
      </div>
    </header>
  );
};

export default Header;
