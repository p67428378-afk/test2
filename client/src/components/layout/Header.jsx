import React from 'react';

export default function Header({ searchQuery, setSearchQuery }) {
  return (
    <header className='h-16 w-full bg-surface-container-lowest text-primary border-b border-outline-variant shadow-sm flex justify-between items-center px-lg z-10 sticky top-0'>
      <div className='font-headline-sm text-headline-sm font-bold text-on-surface'>
        Small Town Value Cluster — Snacks Assortment
      </div>
      <div className='flex items-center gap-lg'>
        {/* Search */}
        <div className='relative w-64'>
          <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline'>search</span>
          <input
            className='w-full pl-10 pr-4 py-2 bg-surface rounded border border-outline-variant focus:outline-none focus:border-on-surface focus:ring-2 focus:ring-primary-container focus:ring-offset-2 text-on-surface transition-all'
            placeholder='Search SKUs...'
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* Actions */}
        <button className='relative p-2 text-on-surface-variant hover:bg-surface-container-high transition-colors rounded-full'>
          <span className='material-symbols-outlined'>notifications</span>
          <span className='absolute top-1 right-1 w-4 h-4 bg-error text-on-error rounded-full text-[10px] flex items-center justify-center font-bold'>2</span>
        </button>
        <div className='w-8 h-8 rounded-full bg-secondary-container overflow-hidden border border-outline-variant flex items-center justify-center text-on-secondary-container font-bold'>
          SJ
        </div>
      </div>
    </header>
  );
}
