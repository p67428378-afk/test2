import React from 'react';

export default function Header() {
  return (
    <header className='fixed top-0 right-0 w-[calc(100%-280px)] h-16 bg-white border-b border-outline-variant flex justify-between items-center px-8 z-10'>
      <div className='flex items-center gap-4'>
        <h2 className='text-lg font-semibold text-primary border-b-2 border-primary h-16 flex items-center'>
          Room Availability &amp; Search
        </h2>
      </div>
      <div className='flex items-center gap-6'>
        <div className='relative w-64 hidden lg:block'>
          <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg'>
            search
          </span>
          <input
            className='w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-border rounded-full text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors'
            placeholder='Search...'
            type='text'
            readOnly
          />
        </div>
        <div className='flex items-center gap-4'>
          <button className='relative p-2 text-slate-500 hover:bg-slate-100 transition-colors rounded-full cursor-pointer'>
            <span className='material-symbols-outlined'>notifications</span>
            <span className='absolute top-1 right-1 w-2 h-2 bg-amber-alert rounded-full'></span>
          </button>
          <div className='flex items-center gap-3 border-l border-slate-border pl-4'>
            <span className='text-sm text-slate-600 hidden md:block'>Elena Rostova</span>
            <div className='w-9 h-9 rounded-full bg-teal-dark flex items-center justify-center text-white font-bold text-sm border border-slate-border'>
              ER
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
