import React from 'react';

export default function Sidebar() {
  return (
    <nav className='fixed left-0 top-0 h-full w-[260px] bg-inverse-surface text-primary font-body-md text-body-md flex flex-col py-lg z-20'>
      {/* Brand Logo */}
      <div className='px-lg pb-xl pt-sm flex items-center gap-3'>
        <div className='w-8 h-8 bg-primary-container rounded flex items-center justify-center font-bold text-on-primary-container'>
          DG
        </div>
        <div>
          <div className='font-headline-sm text-headline-sm font-bold text-primary-fixed'>DG Assortment</div>
          <div className='text-body-sm text-inverse-on-surface/70'>Advisor</div>
        </div>
      </div>

      {/* Navigation Links */}
      <ul className='flex-1 flex flex-col gap-2 px-md'>
        <li>
          <a className='flex items-center gap-3 py-3 rounded-lg text-primary-fixed font-bold border-l-4 border-primary-fixed pl-4 bg-inverse-on-surface/10 transition-all duration-150' href='#'>
            <span className='material-symbols-outlined' style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            Dashboard
          </a>
        </li>
        <li>
          <a className='flex items-center gap-3 py-3 rounded-lg text-surface-variant pl-5 hover:bg-on-surface-variant/10 hover:text-primary-fixed transition-colors transition-all duration-150' href='#'>
            <span className='material-symbols-outlined'>analytics</span>
            Scenarios
          </a>
        </li>
        <li>
          <a className='flex items-center gap-3 py-3 rounded-lg text-surface-variant pl-5 hover:bg-on-surface-variant/10 hover:text-primary-fixed transition-colors transition-all duration-150' href='#'>
            <span className='material-symbols-outlined'>history</span>
            History
          </a>
        </li>
        <li>
          <a className='flex items-center gap-3 py-3 rounded-lg text-surface-variant pl-5 hover:bg-on-surface-variant/10 hover:text-primary-fixed transition-colors transition-all duration-150' href='#'>
            <span className='material-symbols-outlined'>settings</span>
            Settings
          </a>
        </li>
      </ul>

      {/* Footer */}
      <div className='mt-auto px-lg pt-lg border-t border-inverse-on-surface/10'>
        <div className='flex items-center gap-3 text-surface-variant'>
          <span className='material-symbols-outlined'>account_circle</span>
          <div>
            <div className='font-bold text-white'>Sarah Jenkins</div>
            <div className='text-xs opacity-70 text-white/70'>Category Manager</div>
          </div>
        </div>
      </div>
    </nav>
  );
}
