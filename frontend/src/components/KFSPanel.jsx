import React from 'react';

const KFSPanel = () => {
  return (
    <div className='bg-surface-container-lowest p-6 rounded-xl shadow-sm border-l-4 border-secondary'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-[12px] font-bold uppercase tracking-widest headline'>Key Fact Statements</h3>
        <span className='material-symbols-outlined text-secondary text-sm'>description</span>
      </div>
      <div className='space-y-3'>
        <div className='flex items-center gap-3 p-3 bg-surface rounded-lg'>
          <span className='material-symbols-outlined text-green-600' style={{ fontVariationSettings: '\'FILL\' 1' }}>sms</span>
          <div className='flex-1'>
            <div className='text-[11px] font-bold'>KFS_L89422.pdf</div>
            <div className='text-[9px] text-slate-500 uppercase tracking-tight'>Delivered via SMS &amp; Email</div>
          </div>
          <span className='text-[10px] font-bold text-slate-400'>2m ago</span>
        </div>
        <div className='flex items-center gap-3 p-3 bg-surface rounded-lg'>
          <span className='material-symbols-outlined text-slate-400'>mail</span>
          <div className='flex-1'>
            <div className='text-[11px] font-bold'>KFS_L89423.pdf</div>
            <div className='text-[9px] text-slate-500 uppercase tracking-tight'>Processing Delivery...</div>
          </div>
          <span className='text-[10px] font-bold text-slate-400'>14m ago</span>
        </div>
      </div>
    </div>
  );
};

export default KFSPanel;
