
import React from 'react';

const FloatingActionPanel = () => {
  return (
    <div className='fixed bottom-10 left-1/2 -translate-x-1/2 glass-panel p-4 rounded-full border border-white/20 shadow-2xl flex items-center gap-8 z-50'>
      <div className='flex items-center gap-3 pl-4'>
        <div className='w-3 h-3 bg-error rounded-full animate-pulse'></div>
        <span className='text-xs font-bold text-primary uppercase tracking-widest'>Priority Flag Active</span>
      </div>
      <div className='h-6 w-px bg-outline-variant'></div>
      <div className='flex gap-3'>
        <button className='px-6 py-2 bg-error text-on-error font-bold rounded-full text-xs hover:bg-red-700 transition-colors'>Reject Applicant</button>
        <button className='px-6 py-2 bg-primary text-on-primary font-bold rounded-full text-xs hover:bg-primary-container transition-colors'>Approve Override</button>
      </div>
    </div>
  );
};

export default FloatingActionPanel;
