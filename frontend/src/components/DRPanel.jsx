import React from 'react';

const DRPanel = () => {
  return (
    <div className='bg-primary-container p-6 rounded-xl shadow-lg relative overflow-hidden'>
      <div className='absolute -right-4 -top-4 opacity-10'>
        <span className='material-symbols-outlined text-[100px] text-white'>dns</span>
      </div>
      <h3 className='text-[12px] font-bold uppercase tracking-widest text-on-primary-container mb-6'>DR &amp; System Integrity</h3>
      <div className='space-y-4 relative z-10'>
        <div className='flex items-center justify-between'>
          <span className='text-[11px] text-white/70 font-medium'>Last Cloud Backup</span>
          <span className='text-[11px] text-white font-bold font-mono'>14:02 UTC</span>
        </div>
        <div className='flex items-center justify-between'>
          <span className='text-[11px] text-white/70 font-medium'>Restoration Point</span>
          <span className='text-[11px] text-green-400 font-bold'>VALIDATED</span>
        </div>
        <div className='pt-4 border-t border-white/10 flex items-center gap-3'>
          <div className='w-2 h-2 rounded-full bg-green-500 animate-pulse'></div>
          <span className='text-[10px] text-white font-bold uppercase tracking-tighter'>DR Node: AP-SOUTH-1 (Active)</span>
        </div>
      </div>
    </div>
  );
};

export default DRPanel;
