
import React from 'react';

const SideNavBar = () => {
  return (
    <aside className='fixed left-0 h-full w-72 bg-slate-100 flex flex-col pt-24 pb-8 px-6 h-screen border-r border-slate-200/50 z-40'>
      <div className='mb-10 px-3'>
        <p className='text-lg font-black text-blue-900'>Security Terminal</p>
        <p className='text-xs font-medium text-slate-500 uppercase tracking-widest'>Institutional Access</p>
      </div>
      <nav className='flex-1 space-y-2'>
        <a className='p-3 flex items-center gap-3 text-slate-600 hover:translate-x-1 transition-transform duration-200' href='#'>
          <span className='material-symbols-outlined' data-icon='fingerprint'>fingerprint</span>
          <span className='font-inter font-medium text-sm'>Identity Verification</span>
        </a>
        <a className='p-3 flex items-center gap-3 text-slate-600 hover:translate-x-1 transition-transform duration-200' href='#'>
          <span className='material-symbols-outlined' data-icon='face'>face</span>
          <span className='font-inter font-medium text-sm'>Biometrics</span>
        </a>
        <a className='bg-white text-blue-900 rounded-lg shadow-sm font-bold p-3 flex items-center gap-3' href='#'>
          <span className='material-symbols-outlined text-blue-800' data-icon='videocam'>videocam</span>
          <span className='font-inter text-sm'>Video KYC</span>
        </a>
        <a className='p-3 flex items-center gap-3 text-slate-600 hover:translate-x-1 transition-transform duration-200' href='#'>
          <span className='material-symbols-outlined' data-icon='security'>security</span>
          <span className='font-inter font-medium text-sm'>Risk Scoring</span>
        </a>
        <a className='p-3 flex items-center gap-3 text-slate-600 hover:translate-x-1 transition-transform duration-200' href='#'>
          <span className='material-symbols-outlined' data-icon='gavel'>gavel</span>
          <span className='font-inter font-medium text-sm'>Case Management</span>
        </a>
      </nav>
      <div className='mt-auto space-y-4 pt-6 border-t border-slate-200/50'>
        <button className='w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10'>
          <span className='material-symbols-outlined text-sm' data-icon='add'>add</span>
          New Verification
        </button>
        <div className='space-y-1'>
          <a className='flex items-center gap-3 p-2 text-slate-500 hover:text-blue-900 transition-colors' href='#'>
            <span className='material-symbols-outlined text-sm' data-icon='help'>help</span>
            <span className='text-xs font-medium'>Support</span>
          </a>
          <a className='flex items-center gap-3 p-2 text-slate-500 hover:text-red-600 transition-colors' href='#'>
            <span className='material-symbols-outlined text-sm' data-icon='logout'>logout</span>
            <span className='text-xs font-medium'>Logout</span>
          </a>
        </div>
      </div>
    </aside>
  );
};

export default SideNavBar;
