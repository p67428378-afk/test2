import React from 'react';

export default function Header() {
  return (
    <header className='fixed top-0 left-0 right-0 h-[64px] bg-surface-container-lowest z-50 border-b border-outline-variant shadow-sm'>
      <div className='flex justify-between items-center w-full px-margin-x max-w-container-max mx-auto h-full'>
        {/* Brand Logo */}
        <div className='flex items-center gap-stack-sm'>
          <span className='text-headline-sm font-headline-sm font-black text-on-surface'>DG Assortment Advisor</span>
        </div>
        {/* Global Search */}
        <div className='flex-1 max-w-md ml-stack-lg hidden md:block'>
          <div className='relative flex items-center group'>
            <span className='material-symbols-outlined absolute left-3 text-secondary text-[20px]'>search</span>
            <input
              className='w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary focus:border-primary transition-all'
              placeholder='Search categories, SKUs, or clusters...'
              type='text'
            />
          </div>
        </div>
        {/* Trailing Actions */}
        <div className='flex items-center gap-stack-md'>
          <button className='p-2 text-secondary hover:bg-surface-container-low rounded-full transition-colors relative'>
            <span className='material-symbols-outlined'>notifications</span>
            <span className='absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white'></span>
          </button>
          <div className='h-8 w-[1px] bg-outline-variant mx-2'></div>
          <div className='flex items-center gap-3 pl-2'>
            <div className='text-right hidden sm:block'>
              <p className='font-label-md text-label-md text-on-surface'>John Doe</p>
              <p className='font-body-sm text-body-sm text-secondary'>Category Manager</p>
            </div>
            <img
              alt='John Doe'
              className='w-10 h-10 rounded-full border border-outline-variant object-cover'
              src='https://lh3.googleusercontent.com/aida-public/AB6AXuDmvAq2ljiGU7Laj_z8-RMM71dAMbdbUPq2G-Qyhdf20fSlxY4J5ZqBuD6HAYMmLAiiOEHDFU5vvPerdrwDkoEFX_1yFx3T9eo83v9g8i_VkIPNB4C7KS51sl9gwgShOfflDjRAqzJjXU7btLeOs7zEmoNhhKGVRQglWtIyuJHNfFQhiSsFU0aiEGlUgilypXF3Mh5VIUXM9oarSV24TjvvJKfKcQ6AKmlpXmHMGhPPAoEkYb1wN1miz-MS1__DMHZVLBKTXNKatSy1'
            />
          </div>
        </div>
      </div>
    </header>
  );
}
