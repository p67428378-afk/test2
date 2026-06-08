import React from 'react';

export default function TopNavBar() {
  return (
    <header className='bg-primary dark:bg-primary-container text-on-primary dark:text-on-primary-fixed shadow-sm fixed top-0 w-full z-50 h-16 flex justify-between items-center px-margin-desktop max-w-container-max mx-auto left-0 right-0'>
      <div className='flex items-center gap-md'>
        <div className='h-8 w-8 bg-surface-container-lowest rounded p-1 flex items-center justify-center font-bold text-primary text-lg'>
          A
        </div>
        <span className='font-headline-md text-headline-md font-bold text-on-primary hidden md:block'>Apex Bank</span>
      </div>
      <div className='flex items-center gap-sm'>
        <span className='material-symbols-outlined text-on-primary'>lock</span>
        <span className='font-label-md text-label-md text-on-primary font-semibold hidden md:block'>Secure Banking Portal</span>
      </div>
      <nav className='flex items-center gap-lg'>
        <ul className='flex items-center gap-lg'>
          <li className='hidden md:block'>
            <a className='font-label-md text-label-md text-on-primary-fixed-variant opacity-80 hover:bg-primary-fixed-variant/20 transition-colors py-2 px-3 rounded cursor-pointer active:scale-95' href='#'>Customer Support</a>
          </li>
          <li className='hidden md:flex items-center cursor-pointer opacity-80 hover:bg-primary-fixed-variant/20 transition-colors py-2 px-3 rounded'>
            <span className='font-label-md text-label-md text-on-primary-fixed-variant mr-1'>English</span>
            <span className='material-symbols-outlined text-[20px]'>arrow_drop_down</span>
          </li>
          <li>
            <a className='font-label-md text-label-md text-on-primary-fixed-variant opacity-80 hover:bg-primary-fixed-variant/20 transition-colors py-2 px-3 rounded cursor-pointer active:scale-95 flex items-center gap-1' href='#'>
              <span className='material-symbols-outlined'>help</span>
              <span className='hidden lg:inline'>Help</span>
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
