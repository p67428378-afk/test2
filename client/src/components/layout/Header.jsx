import React from 'react';

export default function Header({ title }) {
  return (
    <header className='h-header_height bg-surface border-b border-outline-variant/50 flex items-center justify-between px-margin_desktop z-40 shrink-0'>
      <div className='flex items-center gap-4'>
        <h2 className='font-headline-sm text-headline-sm text-primary font-bold'>{title}</h2>
      </div>
      <div className='flex items-center gap-6'>
        <div className='relative hidden md:block w-64'>
          <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]'>search</span>
          <input
            className='w-full bg-[#0F172A] border border-outline-variant/50 rounded-lg py-1.5 pl-10 pr-4 text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors'
            placeholder="Search batches, tasks..."
            type='text'
          />
        </div>
        <div className='flex items-center gap-4'>
          <button className='relative p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors'>
            <span className='material-symbols-outlined'>notifications</span>
            <span className='absolute top-1.5 right-1.5 w-4 h-4 bg-[#F43F5E] rounded-full flex items-center justify-center font-label-sm text-[10px] text-white font-bold border-2 border-surface'>2</span>
          </button>
          <button className='p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors'>
            <span className='material-symbols-outlined'>account_circle</span>
          </button>
        </div>
      </div>
    </header>
  );
}