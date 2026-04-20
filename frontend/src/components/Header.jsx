
import React from 'react';

const Header = () => {
  return (
    <header className='fixed top-0 right-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl flex justify-between items-center w-[calc(100%-16rem)] ml-64 px-12 py-6'>
      <div className='flex items-center space-x-12'>
        <span className='hidden md:block text-xl font-bold tracking-tighter text-[#002D72] dark:text-white'>The Architectural Vault</span>
        <nav className='flex space-x-8'>
          <a className='text-slate-600 dark:text-slate-400 font-medium font-manrope text-sm tracking-wide hover:text-[#002D72] transition-colors' href='#'>Markets</a>
          <a className='text-[#002D72] dark:text-blue-300 font-bold border-b-2 border-[#002D72] pb-1 font-manrope text-sm tracking-wide' href='#'>Wealth</a>
          <a className='text-slate-600 dark:text-slate-400 font-medium font-manrope text-sm tracking-wide hover:text-[#002D72] transition-colors' href='#'>Legacy</a>
        </nav>
      </div>
      <div className='flex items-center space-x-6'>
        <div className='relative group'>
          <span className='absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400'>search</span>
          <input className='bg-surface-container-low border-none rounded-full py-2 pl-10 pr-4 text-sm w-64 focus:ring-2 focus:ring-primary-container transition-all' placeholder='Search Assets...' type='text'/>
        </div>
        <button className='p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative'>
          <span className='material-symbols-outlined'>notifications</span>
          <span className='absolute top-2 right-2 w-2 h-2 bg-error rounded-full'></span>
        </button>
        <button className='p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors'>
          <span className='material-symbols-outlined'>apps</span>
        </button>
        <img alt='User Portrait' className='w-10 h-10 rounded-full object-cover ring-2 ring-primary-container ring-offset-2' src='https://lh3.googleusercontent.com/aida-public/AB6AXuBcFOJMIoWh7xAylO7SQLK4KpLtrdT4x2ySbpu_pJHI4LpDcBowjirjPqmQ0dUg0ZDIxDGI9eewa57eAStaBGjRpYYGU8Q1M1snXZfoEyQgOXL_rPw5PKi13m4V3RnlpmyyjP39ckxFVCouoeEMPP10GadBnNtZN6uzG17WgSnwhpM238dxFQ8N5p0CGFEpuX2C6iSRKC5Gvkcg6jVvv6q6-z9Flw5x1dBTaobNy3X7AUI3IKma31g7ZfP-56WbwTITa7zU1soapyah'/>
      </div>
    </header>
  );
};

export default Header;
