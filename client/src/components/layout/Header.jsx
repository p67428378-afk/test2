import React from 'react';

export default function Header({ searchQuery, onSearchChange }) {
  return (
    <header className='flex justify-between items-center px-8 h-16 bg-[#0B1326]/80 backdrop-blur-xl border-b border-white/5 z-10 shrink-0'>
      <div className='flex-1 max-w-md'>
        <div className='relative flex items-center w-full input-glow bg-[#0B1326] border border-white/10 rounded-lg transition-all duration-200'>
          <span className='material-symbols-outlined absolute left-3 text-on-surface-variant'>search</span>
          <input
            className='w-full bg-transparent border-none text-on-surface focus:ring-0 pl-10 pr-4 py-2 font-body-md text-body-md placeholder:text-on-surface-variant/50 outline-none'
            placeholder='Search tasks...'
            type='text'
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className='flex items-center gap-6 ml-4'>
        <button className='relative text-on-surface-variant hover:text-on-surface transition-colors'>
          <span className='material-symbols-outlined'>notifications</span>
          <span className='absolute -top-1 -right-1 w-4 h-4 bg-error text-on-error rounded-full flex items-center justify-center text-[10px] font-bold'>2</span>
        </button>
        <div className='w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs border border-white/10 cursor-pointer'>
          AR
        </div>
      </div>
    </header>
  );
}
