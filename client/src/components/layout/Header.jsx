import React from 'react';

export default function Header({ searchQuery = '', setSearchQuery = () => {} }) {
  return (
    <header className='bg-surface-container-lowest border-b border-outline-variant fixed top-0 right-0 h-16 w-[calc(100%-260px)] flex items-center justify-between px-8 z-10'>
      <div className='flex-1 max-w-md focus-within:ring-2 focus-within:ring-primary rounded-lg'>
        <div className='relative w-full'>
          <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
            <span className='material-symbols-outlined text-outline'>search</span>
          </div>
          <input
            type='text'
            className='bg-surface-container-low border-none text-on-surface text-sm rounded-lg block w-full pl-10 p-2.5 focus:ring-0 focus:border-transparent placeholder-on-surface-variant'
            placeholder='Search contacts...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className='flex items-center gap-4'>
        <button className='text-on-surface-variant hover:bg-surface-container p-2 rounded-full transition-all flex items-center justify-center'>
          <span className='material-symbols-outlined'>notifications</span>
        </button>
        <img
          alt='Alex Rivera'
          className='w-8 h-8 rounded-full border border-outline-variant cursor-pointer'
          src='https://lh3.googleusercontent.com/aida-public/AB6AXuBUUqLwInUINbxdrp5XwbsQcXmD6MECn6if3iAXJf1cdYOIaauys-zZ0tSglilqLBRN8WzQgb7_Bm9MvPBz09X6Y232aq8xmQ7y4LWUCV_xEMlO7ku2sVvNHmjMgAMJgcCkhAkLbAPi_ZS9lM4Kb0rupGaHb3h4a4B5HrMr8g6vYkq6BEI6ZieU-kAbID8dqN0Jf700Y6gCMKKjVr-shW9H90JbcjS6I7APzUYXleEfnU5IrszPrj-tDc0xlgxntxiCcIth6RGUk8jZ'
        />
      </div>
    </header>
  );
}
