import React from 'react';

const Header = () => {
  return (
    <header className='fixed top-0 w-full z-50 flex justify-between items-center px-8 h-16 bg-white/80 backdrop-blur-md shadow-xl shadow-slate-200/40'>
      <div className='flex items-center gap-4'>
        <span className='text-xl font-bold tracking-tight text-blue-900'>Sovereign Health</span>
      </div>
      <div className='hidden md:flex gap-8 items-center'>
        <a href='#' className='text-slate-500 font-medium hover:text-blue-600 transition-colors'>Dashboard</a>
        <a href='#' className='text-blue-700 border-b-2 border-blue-700 pb-1 hover:text-blue-600 transition-colors'>Policies</a>
        <a href='#' className='text-slate-500 font-medium hover:text-blue-600 transition-colors'>Providers</a>
        <a href='#' className='text-slate-500 font-medium hover:text-blue-600 transition-colors'>Documents</a>
      </div>
      <div className='flex items-center gap-6'>
        <div className='flex items-center gap-3 text-on-surface-variant text-sm font-medium'>
          <span className='material-symbols-outlined text-[20px]'>lock</span>
          <span>Last login: Today, 10:42 AM</span>
        </div>
        <div className='flex items-center gap-4'>
          <button className='material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors'>notifications</button>
          <button className='px-5 py-1.5 rounded-full premium-gradient text-white text-sm font-bold shadow-md hover:opacity-90 active:scale-[0.98] transition-all'>Logout</button>
        </div>
      </div>
    </header>
  );
};

export default Header;
