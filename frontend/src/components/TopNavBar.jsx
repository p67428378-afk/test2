import React from 'react';

const TopNavBar = () => {
  return (
    <nav className='fixed top-0 w-full z-50 bg-slate-50/80 backdrop-blur-xl shadow-sm flex justify-between items-center px-12 h-20 w-full'>
      <div className='flex items-center gap-8'>
        <span className='text-xl font-bold tracking-tight text-blue-900'>The Architectural Sentinel</span>
        <div className='hidden md:flex gap-6 font-manrope font-semibold text-sm tracking-wide'>
          <a className='text-slate-500 hover:text-blue-700 transition-colors' href="#">Dashboard</a>
          <a className='text-slate-500 hover:text-blue-700 transition-colors' href="#">Analytics</a>
          <a className='text-blue-900 border-b-2 border-blue-900 pb-1' href="#">Compliance</a>
          <a className='text-slate-500 hover:text-blue-700 transition-colors' href="#">Audit Logs</a>
          <a className='text-slate-500 hover:text-blue-700 transition-colors' href="#">Settings</a>
        </div>
      </div>
      <div className='flex items-center gap-4'>
        <button className='p-2 hover:bg-slate-200/50 rounded-full transition-colors'><span className="material-symbols-outlined" data-icon="notifications">notifications</span></button>
        <button className='p-2 hover:bg-slate-200/50 rounded-full transition-colors'><span className="material-symbols-outlined" data-icon="history">history</span></button>
        <button className='p-2 hover:bg-slate-200/50 rounded-full transition-colors'><span className="material-symbols-outlined" data-icon="account_circle">account_circle</span></button>
      </div>
    </nav>
  );
};

export default TopNavBar;
