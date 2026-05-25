import React from 'react';

const StatusIndicator = () => {
  return (
    <section className='col-span-12 lg:col-span-4 flex flex-col h-full'>
      <div className='flex-1 glass-card rounded-full p-10 border border-white/50 shadow-xl shadow-blue-900/5 flex flex-col items-center justify-center text-center'>
        <div className='relative mb-8'>
          <div className='absolute inset-0 bg-tertiary-fixed blur-3xl opacity-20 animate-pulse'></div>
          <div className='relative w-32 h-32 bg-white rounded-full shadow-inner flex items-center justify-center border border-surface-variant'>
            <span className='material-symbols-outlined text-7xl text-tertiary' style={{fontVariationSettings: '\'FILL\' 1'}}>check_circle</span>
          </div>
        </div>
        <div className='space-y-2 mb-10'>
          <p className='text-xs font-bold text-tertiary tracking-[0.4em] uppercase'>Status Check Complete</p>
          <h2 className='text-3xl font-headline font-extrabold text-blue-950'>KYC STATUS: APPROVED</h2>
          <p className='text-sm text-on-surface-variant max-w-[200px] mx-auto'>This profile is certified for high-value institutional transactions.</p>
        </div>
        <button className='w-full py-4 bg-gradient-primary text-white rounded-xl font-manrope font-extrabold text-sm uppercase tracking-widest shadow-xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-[0.98] transition-all'>
          <span className='material-symbols-outlined'>download</span>
          Download Certificate
        </button>
        <p className='mt-6 text-[10px] font-bold text-outline uppercase tracking-tighter'>Certificate ID: CRT-552-KL-01</p>
      </div>
    </section>
  );
};

export default StatusIndicator;
