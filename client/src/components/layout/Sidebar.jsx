import React from 'react';

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className='fixed left-0 top-0 h-screen w-sidebar_width bg-surface-container border-r border-outline-variant/50 shadow-sm flex flex-col py-margin_desktop z-50'>
      <div className='px-6 mb-8 flex items-center gap-3'>
        <span className='material-symbols-outlined text-primary text-[32px]'>local_florist</span>
        <div>
          <h1 className='font-headline-md text-headline-md font-bold text-primary'>FloraFlow</h1>
          <p className='font-label-sm text-label-sm text-on-surface-variant'>Precision Agronomy</p>
        </div>
      </div>

      <div className='px-4 mb-6'>
        <button className='w-full bg-primary-container text-on-primary-container font-label-lg py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-primary transition-colors duration-200 shadow-sm'>
          <span className='material-symbols-outlined text-[20px]'>add</span>
          New Analysis
        </button>
      </div>

      <nav className='flex-1 overflow-y-auto px-2 space-y-1'>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer active:scale-95 transition-all duration-200 border-l-4 ${
            activeTab === 'dashboard'
              ? 'bg-surface-container-highest text-primary border-primary'
              : 'text-on-surface-variant hover:bg-surface-container-high border-transparent'
          }`}
        >
          <span className={`material-symbols-outlined ${activeTab === 'dashboard' ? 'filled' : ''}`}>dashboard</span>
          <span className='font-label-lg text-label-lg'>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer active:scale-95 transition-all duration-200 border-l-4 ${
            activeTab === 'inventory'
              ? 'bg-surface-container-highest text-primary border-primary'
              : 'text-on-surface-variant hover:bg-surface-container-high border-transparent'
          }`}
        >
          <span className={`material-symbols-outlined ${activeTab === 'inventory' ? 'filled' : ''}`}>inventory_2</span>
          <span className='font-label-lg text-label-lg'>Inventory</span>
        </button>

        <button
          onClick={() => setActiveTab('growth')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer active:scale-95 transition-all duration-200 border-l-4 ${
            activeTab === 'growth'
              ? 'bg-surface-container-highest text-primary border-primary'
              : 'text-on-surface-variant hover:bg-surface-container-high border-transparent'
          }`}
        >
          <span className={`material-symbols-outlined ${activeTab === 'growth' ? 'filled' : ''}`}>monitoring</span>
          <span className='font-label-lg text-label-lg'>Growth Tracking</span>
        </button>

        <button
          onClick={() => setActiveTab('scheduling')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer active:scale-95 transition-all duration-200 border-l-4 ${
            activeTab === 'scheduling'
              ? 'bg-surface-container-highest text-primary border-primary'
              : 'text-on-surface-variant hover:bg-surface-container-high border-transparent'
          }`}
        >
          <span className={`material-symbols-outlined ${activeTab === 'scheduling' ? 'filled' : ''}`}>calendar_today</span>
          <span className='font-label-lg text-label-lg'>Scheduling</span>
        </button>
      </nav>

      <div className='mt-auto px-2 pt-4 border-t border-outline-variant/30 space-y-1'>
        <a className='flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg cursor-pointer active:scale-95 transition-colors duration-200' href='#'>
          <span className='material-symbols-outlined'>settings</span>
          <span className='font-label-lg text-label-lg'>Settings</span>
        </a>
        <a className='flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-high rounded-lg cursor-pointer active:scale-95 transition-colors duration-200' href='#'>
          <span className='material-symbols-outlined'>help</span>
          <span className='font-label-lg text-label-lg'>Support</span>
        </a>
        <div className='mt-4 px-4 py-3 flex items-center gap-3 bg-surface-container-low rounded-lg border border-outline-variant/30'>
          <div className='w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-label-lg font-bold'>FJ</div>
          <div className='flex-1 overflow-hidden'>
            <p className='font-label-lg text-label-lg text-on-surface truncate'>Farmer John</p>
            <p className='font-label-sm text-label-sm text-on-surface-variant truncate'>Operator</p>
          </div>
        </div>
      </div>
    </aside>
  );
}