import React from 'react';

const SideNavBar = () => {
  return (
    <nav className='h-screen w-64 fixed left-0 top-0 pt-20 bg-slate-50 flex flex-col space-y-2 px-4 border-r border-outline-variant/10'>
      <div className='mb-8 px-2'>
        <p className='text-xs font-bold uppercase tracking-widest text-slate-400 mb-1'>Welcome back</p>
        <p className='font-headline font-extrabold text-sky-900 text-lg'>Active Coverage</p>
      </div>
      <div className='flex flex-col gap-1'>
        <a className='flex items-center gap-3 px-4 py-3 text-slate-500 font-semibold text-sm hover:bg-slate-100 transition-all rounded-xl duration-200' href='#'>
          <span className='material-symbols-outlined'>dashboard</span> Dashboard
        </a>
        <a className='flex items-center gap-3 px-4 py-3 bg-sky-50 text-sky-900 border-r-4 border-sky-900 font-semibold text-sm rounded-l-xl duration-200' href='#'>
          <span className='material-symbols-outlined'>description</span> Policy Details
        </a>
        <a className='flex items-center gap-3 px-4 py-3 text-slate-500 font-semibold text-sm hover:bg-slate-100 transition-all rounded-xl duration-200' href='#'>
          <span className='material-symbols-outlined'>receipt_long</span> Claim History
        </a>
        <a className='flex items-center gap-3 px-4 py-3 text-slate-500 font-semibold text-sm hover:bg-slate-100 transition-all rounded-xl duration-200' href='#'>
          <span className='material-symbols-outlined'>payments</span> Payments
        </a>
        <a className='flex items-center gap-3 px-4 py-3 text-slate-500 font-semibold text-sm hover:bg-slate-100 transition-all rounded-xl duration-200' href='#'>
          <span className='material-symbols-outlined'>settings</span> Settings
        </a>
      </div>
      <div className='mt-auto pb-10 px-2'>
        <button className='w-full py-3 bg-gradient-to-r from-primary to-primary-container text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/10 hover:opacity-90 transition-all'>
          Renew Policy
        </button>
      </div>
    </nav>
  );
};

export default SideNavBar;
