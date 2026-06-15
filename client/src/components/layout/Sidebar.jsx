import React from 'react';

export default function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className='fixed left-0 top-0 h-full w-[280px] bg-inverse-surface border-r border-outline-variant flex flex-col py-6 z-20 text-white'>
      <div className='px-6 mb-8'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center overflow-hidden'>
            <span className='material-symbols-outlined text-primary text-2xl'>hotel</span>
          </div>
          <div>
            <h1 className='font-semibold text-lg text-secondary-fixed'>Grand Horizon</h1>
            <p className='text-xs text-outline'>Management Portal</p>
          </div>
        </div>
      </div>
      <nav className='flex-1 space-y-1 mt-4'>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`w-full flex items-center gap-4 px-6 py-3 transition-colors cursor-pointer text-left ${
            activeTab === 'dashboard'
              ? 'bg-primary-container text-on-primary-container border-l-4 border-primary font-medium'
              : 'text-slate-300 hover:text-white hover:bg-surface-container-highest'
          }`}
        >
          <span className='material-symbols-outlined'>dashboard</span>
          <span className='text-sm'>Dashboard</span>
        </button>
        <button
          onClick={() => setActiveTab('reservations')}
          className={`w-full flex items-center gap-4 px-6 py-3 transition-colors cursor-pointer text-left ${
            activeTab === 'reservations'
              ? 'bg-primary-container text-on-primary-container border-l-4 border-primary font-medium'
              : 'text-slate-300 hover:text-white hover:bg-surface-container-highest'
          }`}
        >
          <span className='material-symbols-outlined'>calendar_month</span>
          <span className='text-sm'>Reservations</span>
        </button>
      </nav>
      <div className='mt-auto px-6'>
        <div className='flex items-center gap-3 py-2 text-slate-300'>
          <div className='w-8 h-8 rounded-full bg-teal-dark flex items-center justify-center text-white font-bold text-sm'>
            ER
          </div>
          <span className='text-sm font-medium'>Elena Rostova</span>
        </div>
      </div>
    </aside>
  );
}
