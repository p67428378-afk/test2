import React from 'react';

export default function Sidebar({ currentFilter, onFilterChange }) {
  return (
    <aside className='hidden md:flex flex-col justify-between fixed left-0 top-0 h-full w-[260px] bg-[#0B1326] border-r border-white/5 py-8 z-20'>
      <div>
        <div className='px-8 mb-8 flex items-center gap-2'>
          <span className='material-symbols-outlined text-primary text-3xl'>task_alt</span>
          <span className='font-headline-md text-headline-md text-on-surface font-bold tracking-tight'>TaskFlow</span>
        </div>
        <nav className='flex flex-col gap-2'>
          <button
            onClick={() => onFilterChange('all')}
            className={`flex items-center gap-3 px-4 py-3 active:scale-95 transition-transform duration-200 font-label-md text-label-md w-full text-left ${
              currentFilter === 'all'
                ? 'bg-primary/10 text-primary border-l-4 border-primary'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
            }`}
          >
            <span className='material-symbols-outlined' style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
            Dashboard
          </button>
          <button
            onClick={() => onFilterChange('completed')}
            className={`flex items-center gap-3 px-4 py-3 active:scale-95 transition-transform duration-200 font-label-md text-label-md w-full text-left ${
              currentFilter === 'completed'
                ? 'bg-primary/10 text-primary border-l-4 border-primary'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
            }`}
          >
            <span className='material-symbols-outlined'>task_alt</span>
            Completed
          </button>
          <button
            onClick={() => onFilterChange('active')}
            className={`flex items-center gap-3 px-4 py-3 active:scale-95 transition-transform duration-200 font-label-md text-label-md w-full text-left ${
              currentFilter === 'active'
                ? 'bg-primary/10 text-primary border-l-4 border-primary'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
            }`}
          >
            <span className='material-symbols-outlined'>pending_actions</span>
            Active
          </button>
        </nav>
      </div>
      <div className='px-4'>
        <div className='flex items-center gap-3 px-4 py-3 bg-surface-container-low rounded-xl'>
          <div className='w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold'>
            AR
          </div>
          <div className='flex flex-col'>
            <span className='font-label-md text-label-md text-on-surface'>Alex Rivera</span>
            <span className='font-label-sm text-label-sm text-on-surface-variant'>Productivity Enthusiast</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
