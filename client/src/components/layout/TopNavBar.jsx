import React from 'react';

export default function TopNavBar() {
  return (
    <nav aria-label='Main Navigation' className='bg-surface-container-lowest dark:bg-inverse-surface border-b border-outline-variant dark:border-outline shadow-sm flex justify-between items-center h-[64px] px-margin w-full max-w-[1440px] mx-auto z-50 sticky top-0' role='navigation'>
      <div className='flex items-center gap-6'>
        <div className='flex items-center gap-2'>
          <div className='w-8 h-8 bg-primary-container rounded flex items-center justify-center font-bold text-on-primary-container text-xs'>DG</div>
          <div className='font-headline-md text-headline-md font-bold text-on-surface dark:text-surface-bright hidden sm:block'>DG Retail Manager</div>
        </div>
        <div className='hidden md:flex gap-6 h-[64px]'>
          <a className='text-primary dark:text-primary-fixed border-b-2 border-primary dark:border-primary-fixed pb-1 hover:bg-surface-container-low dark:hover:bg-surface-container-high transition-colors cursor-pointer active:opacity-80 flex flex-col justify-center font-body-md text-body-md h-full mt-1' href='#'>Inventory</a>
          <a className='text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-surface-container-low dark:hover:bg-surface-container-high transition-colors cursor-pointer active:opacity-80 flex flex-col justify-center font-body-md text-body-md h-full mt-1 border-b-2 border-transparent' href='#'>Pricing</a>
          <a className='text-on-secondary-fixed-variant dark:text-secondary-fixed-dim hover:bg-surface-container-low dark:hover:bg-surface-container-high transition-colors cursor-pointer active:opacity-80 flex flex-col justify-center font-body-md text-body-md h-full mt-1 border-b-2 border-transparent' href='#'>Logistics</a>
        </div>
      </div>
      <div className='flex items-center gap-4 text-primary dark:text-primary-fixed'>
        <button className='w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low dark:hover:bg-surface-container-high transition-colors cursor-pointer active:opacity-80'>
          <span className='material-symbols-outlined'>search</span>
        </button>
        <button className='w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low dark:hover:bg-surface-container-high transition-colors cursor-pointer active:opacity-80'>
          <span className='material-symbols-outlined'>notifications</span>
        </button>
        <button className='w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low dark:hover:bg-surface-container-high transition-colors cursor-pointer active:opacity-80'>
          <span className='material-symbols-outlined'>settings</span>
        </button>
        <div className='w-8 h-8 rounded-full bg-surface-variant overflow-hidden cursor-pointer active:opacity-80 border border-outline-variant'>
          <img alt='User profile photo' className='w-full h-full object-cover' src='https://lh3.googleusercontent.com/aida-public/AB6AXuCKpOdXhzEcAijn7kMqtWU57r1wF0W2WlRnIsBjhYer-aZIpalxukMZe7zE6eXLbsBHqsyt2qSkxMZdrA5X4noVLUowpsJsBatEWmFaBzms-8vaCOqkKGIeZLICjvTu3qVH7Vog38V3hC5I0oN4H3JbS-E0MrUy6Xl-sFNquu1FQ-75F0qWxSUMDExJxbEtjn6iPkyR4ei8HwSFWR9zq-aLZJrrZ-vvSvMC8RoUT0UANqAHIf7_38YjLj28yQN3PmSjm7imQQRfLwQ3' />
        </div>
      </div>
    </nav>
  );
}