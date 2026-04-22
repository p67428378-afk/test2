
import React from 'react';

const Header = () => {
  return (
    <header className="w-full sticky top-0 z-50 bg-slate-50/70 dark:bg-slate-950/70 backdrop-blur-xl">
      <div className="flex justify-between items-center w-full px-12 py-4 max-w-[1920px] mx-auto">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-widest text-blue-900 dark:text-white font-headline">Vault Security Console</span>
          <nav className="hidden md:flex items-center gap-6">
            <a className="text-slate-500 dark:text-slate-400 font-medium font-manrope tracking-tight hover:text-blue-700 transition-colors" href="#">Dashboard</a>
            <a className="text-blue-900 dark:text-white border-b-2 border-blue-900 dark:border-blue-400 pb-1 font-manrope tracking-tight font-semibold" href="#">Card Management</a>
            <a className="text-slate-500 dark:text-slate-400 font-medium font-manrope tracking-tight hover:text-blue-700 transition-colors" href="#">Security Logs</a>
            <a className="text-slate-500 dark:text-slate-400 font-medium font-manrope tracking-tight hover:text-blue-700 transition-colors" href="#">Support</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-slate-500 hover:text-blue-700">notifications</button>
          <button className="material-symbols-outlined text-slate-500 hover:text-blue-700">settings</button>
          <div className="h-8 w-px bg-slate-200/50"></div>
          <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-4 py-2 rounded-xl text-sm font-semibold scale-95 duration-200">Emergency Block</button>
          <img alt="User profile" className="w-10 h-10 rounded-full border-2 border-white shadow-sm" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5XvzX-BACY7q-EvhWHj-h4fQQ9XwyPxaOtK-zIVinlJxUuQbR7zA7cNGxNImHkF8JIKwgCqq-aJCZD9qYLSFa8UbYzXq5G-XHa7UidN9yRLyaiJUWTa2ElSSqixTbVVNX8WfcYKW8V5PMS8xHr7fa7f9VuO2KcFZ-Ve60rpb_P-RHetMWlnnBKXPHrAssrsTzBfM-Xhwg5vFMPYuzIEMoyYmtXVEi6nwTWBonSQMoD9duVFv741gZlcv_luB6URLCbMt8TMgOPuA"/>
        </div>
      </div>
      <div className="bg-slate-200/50 dark:bg-slate-800/50 h-px"></div>
    </header>
  );
};

export default Header;
