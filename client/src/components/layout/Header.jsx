import React from 'react';

export default function Header({ searchQuery, setSearchQuery }) {
  return (
    <header className='bg-surface-container dark:bg-surface-container-high font-title-sm text-title-sm fixed top-0 right-0 left-[260px] flex justify-between items-center px-lg h-[64px] border-b border-outline-variant dark:border-surface-container-highest z-40'>
      <div className='font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed tracking-tight'>
        DG Cluster Assortment Advisor <span className='text-on-surface-variant font-normal'>— Small Town Value Cluster</span>
      </div>
      <div className='flex items-center gap-lg'>
        <div className='relative w-64'>
          <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant'>
            search
          </span>
          <input
            className='w-full bg-[#1E293B] border border-[#334155] text-on-surface rounded py-1.5 pl-10 pr-3 focus:outline-none focus:border-primary-container text-sm transition-colors'
            placeholder='Search SKUs...'
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className='flex items-center gap-md'>
          <button className='relative text-on-surface-variant dark:text-on-surface hover:text-primary transition-colors duration-200 cursor-pointer active:opacity-80'>
            <span className='material-symbols-outlined'>notifications</span>
            <span className='absolute -top-1 -right-1 bg-error text-on-error text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center'>
              2
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
