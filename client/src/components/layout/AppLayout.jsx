import React from 'react';
import Header from './Header.jsx';

export default function AppLayout({ children }) {
  return (
    <div className='min-h-screen bg-background text-on-background flex flex-col'>
      <Header />
      <div className='flex pt-[64px] min-h-[calc(100vh-64px)]'>
        {/* SideNavBar */}
        <aside className='hidden md:flex flex-col h-[calc(100vh-64px)] py-stack-lg px-stack-md gap-stack-sm bg-surface border-r border-outline-variant w-64 sticky top-[64px]'>
          <nav className='flex-1 flex flex-col gap-1'>
            <a className='flex items-center gap-3 px-4 py-3 bg-primary-container text-on-primary-container font-semibold rounded-lg scale-95 transition-transform duration-100' href='#'>
              <span className='material-symbols-outlined'>dashboard</span>
              <span className='font-label-md text-label-md'>Assortment Plan</span>
            </a>
            <a className='flex items-center gap-3 px-4 py-3 text-secondary hover:bg-surface-container-high rounded-lg transition-colors' href='#'>
              <span className='material-symbols-outlined'>query_stats</span>
              <span className='font-label-md text-label-md'>SKU Performance</span>
            </a>
            <a className='flex items-center gap-3 px-4 py-3 text-secondary hover:bg-surface-container-high rounded-lg transition-colors' href='#'>
              <span className='material-symbols-outlined'>strategy</span>
              <span className='font-label-md text-label-md'>Scenario Analysis</span>
            </a>
            <a className='flex items-center gap-3 px-4 py-3 text-secondary hover:bg-surface-container-high rounded-lg transition-colors' href='#'>
              <span className='material-symbols-outlined'>rule</span>
              <span className='font-label-md text-label-md'>Guardrails</span>
            </a>
          </nav>
          <div className='mt-auto flex flex-col gap-1 border-t border-outline-variant pt-stack-md'>
            <a className='flex items-center gap-3 px-4 py-3 text-secondary hover:bg-surface-container-high rounded-lg transition-colors' href='#'>
              <span className='material-symbols-outlined'>settings</span>
              <span className='font-label-md text-label-md'>Settings</span>
            </a>
            <a className='flex items-center gap-3 px-4 py-3 text-secondary hover:bg-surface-container-high rounded-lg transition-colors' href='#'>
              <span className='material-symbols-outlined'>help</span>
              <span className='font-label-md text-label-md'>Support</span>
            </a>
            <button className='mt-stack-md w-full py-2 bg-on-background text-white font-label-md rounded-lg hover:opacity-90 transition-opacity'>
              Export Report
            </button>
          </div>
        </aside>
        {/* Main Content */}
        <main className='flex-1 p-margin-x max-w-container-max mx-auto w-full pb-24 md:pb-margin-x'>
          {children}
        </main>
      </div>
      {/* Bottom Mobile Nav */}
      <nav className='md:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface-container-lowest border-t border-outline-variant flex items-center justify-around px-4 z-50'>
        <button className='flex flex-col items-center gap-1 text-primary'>
          <span className='material-symbols-outlined' style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span className='text-[10px] font-bold uppercase'>Plan</span>
        </button>
        <button className='flex flex-col items-center gap-1 text-secondary'>
          <span className='material-symbols-outlined'>query_stats</span>
          <span className='text-[10px] font-bold uppercase'>Stats</span>
        </button>
        <button className='flex flex-col items-center gap-1 text-secondary'>
          <span className='material-symbols-outlined'>strategy</span>
          <span className='text-[10px] font-bold uppercase'>Strategy</span>
        </button>
        <button className='flex flex-col items-center gap-1 text-secondary'>
          <span className='material-symbols-outlined'>settings</span>
          <span className='text-[10px] font-bold uppercase'>Settings</span>
        </button>
      </nav>
    </div>
  );
}
