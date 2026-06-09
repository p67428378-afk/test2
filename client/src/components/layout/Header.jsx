import React from 'react';

const Header = ({ searchTerm, onSearchChange }) => {
  return (
    <header className='hidden md:flex justify-between items-center px-6 h-[64px] bg-surface-container border-b border-outline-variant fixed top-0 right-0 left-[260px] z-10'>
      <div className='flex items-center space-x-6'>
        <div>
          <h2 className='text-lg font-bold text-primary-container tracking-tight'>
            Small Town Value Cluster — Snacks Category
          </h2>
          <p className='text-xs text-on-surface-variant'>Assortment Optimization Dashboard</p>
        </div>
      </div>
      <div className='flex items-center space-x-6'>
        <div className='relative'>
          <span className='material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm'>
            search
          </span>
          <input
            type='text'
            value={searchTerm || ''}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            className='bg-background border border-outline-variant text-on-surface text-xs rounded-md pl-8 pr-4 py-1 focus:ring-1 focus:ring-primary-container focus:border-primary-container w-[240px] placeholder:text-on-surface-variant transition-colors'
            placeholder='Search SKUs...'
          />
        </div>
        <div className='flex items-center space-x-2'>
          <button className='relative p-2 rounded-full text-on-surface-variant hover:bg-surface-container-highest transition-colors cursor-pointer active:opacity-80'>
            <span className='material-symbols-outlined text-xl'>notifications</span>
            <span className='absolute top-1 right-1 w-3 h-3 bg-primary-container rounded-full flex items-center justify-center text-[8px] text-on-primary-container border border-surface-container'>
              2
            </span>
          </button>
          <button className='p-2 rounded-full text-on-surface-variant hover:bg-surface-container-highest transition-colors cursor-pointer active:opacity-80'>
            <span className='material-symbols-outlined text-xl'>account_circle</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
