import React from 'react';

const TopNavBar = () => {
  return (
    <header className='fixed top-0 right-0 left-64 z-40 flex items-center justify-between px-8 bg-slate-100/60 dark:bg-slate-900/60 backdrop-blur-md h-16 shadow-sm dark:shadow-none'>
      <div className='flex items-center gap-6 flex-1'>
        <div className='relative w-full max-w-md group'>
          <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600'>search</span>
          <input className='w-full bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-secondary outline-none transition-all' placeholder='Search loan ID, borrower or transaction...' type='text'/>
        </div>
        <div className='flex items-center gap-2 px-3 py-1 bg-green-100 border-l-4 border-green-500 rounded-sm'>
          <span className='material-symbols-outlined text-green-700 text-sm' style={{ fontVariationSettings: '\'FILL\' 1' }}>check_circle</span>
          <span className='text-[12px] font-bold text-green-700 uppercase tracking-tighter'>System Healthy</span>
        </div>
      </div>
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-2'>
          <button className='w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-200/50 rounded-full transition-colors'>
            <span className='material-symbols-outlined'>notifications</span>
          </button>
          <button className='w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-200/50 rounded-full transition-colors'>
            <span className='material-symbols-outlined'>history</span>
          </button>
          <button className='w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-200/50 rounded-full transition-colors'>
            <span className='material-symbols-outlined'>help_outline</span>
          </button>
        </div>
        <div className='h-8 w-[1px] bg-slate-300 mx-2'></div>
        <div className='flex items-center gap-3'>
          <div className='text-right'>
            <div className='text-sm font-bold text-slate-900'>Admin_9x44</div>
            <div className='text-[10px] text-slate-500 font-mono'>ID: 00492-SL</div>
          </div>
          <img className='w-10 h-10 rounded-lg object-cover border-2 border-white shadow-sm' data-alt='Professional headshot of a financial administrator in a corporate setting with soft ambient office lighting' src='https://lh3.googleusercontent.com/aida-public/AB6AXuC3o5LKQ5agk-aMBxD6UHlFW8MelNi2gWls7KulIL8UYK_MjSgjYUt-WB2P2CKcG0PuPmnsR4y2-bcuEuSOhrEL_NEWaI_rp5IIYs_KuTZjLTeXufzsyFxCSnVGhP6tO_IhsgZcT0MJqI4tIIm0cvQxOhHLX__1b37vFnz5YKdNaHwxQAcGpfjuP5my5y-5E3hlE7EsxQdEEYRQZWXN_xeMtfT3w9SdztCiV0tNyRnF-qOzgAQWZtjoSdEpURjAsjEi6bK07878sk8'/>
        </div>
      </div>
    </header>
  );
};

export default TopNavBar;
