import React from 'react';
import PolicyDetails from './components/PolicyDetails';
import PolicyUpdateRequest from './components/PolicyUpdateRequest';
import PolicyCancelRequest from './components/PolicyCancelRequest';

function App() {
  return (
    <div className='bg-surface text-on-surface'>
      <aside className='h-screen w-64 fixed left-0 top-0 border-r-0 bg-slate-50 dark:bg-slate-900 flex flex-col h-full py-8 px-4 z-50 tonal-shift bg-slate-100'>
        <div className='mb-10 px-4'>
          <h1 className='text-xl font-bold tracking-tight text-cyan-950 dark:text-cyan-50 font-manrope'>Clinical Curator</h1>
          <p className='text-xs text-secondary font-medium mt-1'>Premium Health Member</p>
        </div>
        <nav className='flex-1 space-y-2'>
          <a className='flex items-center gap-3 px-4 py-3 rounded-lg text-cyan-700 font-semibold border-r-4 border-cyan-700 bg-slate-200/50 transition-colors' href='#'>
            <span className='material-symbols-outlined' data-icon='dashboard'>dashboard</span>
            <span className='font-body'>Dashboard</span>
          </a>
          <a className='flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:text-cyan-600 hover:bg-slate-200/50 transition-colors' href='#'>
            <span className='material-symbols-outlined' data-icon='receipt_long'>receipt_long</span>
            <span className='font-body'>Claims</span>
          </a>
          <a className='flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:text-cyan-600 hover:bg-slate-200/50 transition-colors' href='#'>
            <span className='material-symbols-outlined' data-icon='medical_services'>medical_services</span>
            <span className='font-body'>Providers</span>
          </a>
          <a className='flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:text-cyan-600 hover:bg-slate-200/50 transition-colors' href='#'>
            <span className='material-symbols-outlined' data-icon='verified_user'>verified_user</span>
            <span className='font-body'>Benefits</span>
          </a>
          <a className='flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:text-cyan-600 hover:bg-slate-200/50 transition-colors' href='#'>
            <span className='material-symbols-outlined' data-icon='folder_open'>folder_open</span>
            <span className='font-body'>Documents</span>
          </a>
        </nav>
        <div className='mt-auto space-y-2 border-t border-outline-variant/10 pt-6'>
          <button className='w-full vitality-gradient text-white py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-sm scale-95 duration-150 active:scale-90'>
            <span className='material-symbols-outlined text-sm' data-icon='search'>search</span>
            Find a Doctor
          </button>
          <a className='flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:text-cyan-600 hover:bg-slate-200/50 transition-colors mt-4' href='#'>
            <span className='material-symbols-outlined' data-icon='help_outline'>help_outline</span>
            <span className='font-body text-sm'>Support</span>
          </a>
          <a className='flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:text-cyan-600 hover:bg-slate-200/50 transition-colors' href='#'>
            <span className='material-symbols-outlined' data-icon='settings'>settings</span>
            <span className='font-body text-sm'>Settings</span>
          </a>
        </div>
      </aside>
      <header className='fixed top-0 right-0 w-[calc(100%-16rem)] z-40 bg-white/80 backdrop-blur-md flex justify-between items-center px-8 h-20 tonal-transition'>
        <div className='flex items-center flex-1 max-w-xl'>
          <div className='relative w-full'>
            <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant' data-icon='search'>search</span>
            <input className='w-full bg-surface-container-low border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary/20 placeholder:text-outline' placeholder='Search claims, doctors, or policy details...' type='text' />
          </div>
        </div>
        <div className='flex items-center gap-6'>
          <div className='flex items-center gap-4 text-slate-600'>
            <button className='opacity-80 active:opacity-100 hover:text-cyan-600 transition-colors'>
              <span className='material-symbols-outlined' data-icon='notifications'>notifications</span>
            </button>
            <button className='opacity-80 active:opacity-100 hover:text-cyan-600 transition-colors'>
              <span className='material-symbols-outlined' data-icon='chat_bubble_outline'>chat_bubble_outline</span>
            </button>
          </div>
          <div className='h-8 w-[1px] bg-outline-variant/30'></div>
          <div className='flex items-center gap-3'>
            <div className='text-right'>
              <p className='text-sm font-bold text-cyan-950 font-manrope leading-none'>Alexander Pierce</p>
              <p className='text-[10px] text-secondary font-medium tracking-wider'>MEMBER ID: #8829104</p>
            </div>
            <img className='w-10 h-10 rounded-full object-cover border-2 border-primary-fixed' data-alt='Professional portrait of a male health insurance policy holder with a friendly expression in studio lighting' src='https://lh3.googleusercontent.com/aida-public/AB6AXuBmCiBd-IAqXA43GwtiNqVhlmdligJvaISkvhc0a18iMQN5WyxvBl0AlwTpPJV3Sh_v3mGLjout7th8R-p-n0DS6G3vd33uFIf0tT3fmR7Zaj4y2w44A2RTpZlavvATc3R_KhRp1KOJtfh-aWc9DxCx3uXmEkAyfr-1QFR39Q4sLY40wgiQD3k1FZxy1pOwtUVhB3c8pmLkInIyBPPQnbi5BLmy695T6iEUiCkjoXcPAL8N29OkIHljlNtVHfRYKv_wHnZIjJ-u6Wk' />
          </div>
        </div>
      </header>
      <main className='ml-64 pt-20 min-h-screen bg-surface'>
        <div className='max-w-7xl mx-auto px-10 py-12'>
          <PolicyDetails />
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12'>
            <div className='lg:col-span-2'>
              <PolicyUpdateRequest />
            </div>
            <div className='space-y-8'>
              <PolicyCancelRequest />
            </div>
          </div>
          <footer className='mt-20 pt-12 border-t border-outline-variant/10 flex justify-between items-center text-outline'>
            <p className='text-xs'>© 2024 Clinical Curator Health Experience. All rights reserved.</p>
            <div className='flex gap-6 text-xs font-semibold'>
              <a className='hover:text-primary transition-colors' href='#'>Privacy Policy</a>
              <a className='hover:text-primary transition-colors' href='#'>HIPAA Compliance</a>
              <a className='hover:text-primary transition-colors' href='#'>Accessibility</a>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}

export default App;
