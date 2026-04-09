import React from 'react';

const PaymentStatusSummary = () => {
  return (
    <div className='bg-surface-container-lowest p-6 rounded-xl ghost-border'>
      <div className='text-[12px] font-bold text-on-surface-variant uppercase tracking-widest mb-4 headline'>Payment Status Summary</div>
      <div className='flex items-end gap-1 h-12 mb-4'>
        <div className='flex-1 bg-green-500 h-[85%] rounded-sm group relative' title='On Time: 85%'></div>
        <div className='flex-1 bg-amber-500 h-[10%] rounded-sm group relative' title='Delayed: 10%'></div>
        <div className='flex-1 bg-error h-[5%] rounded-sm group relative' title='Default: 5%'></div>
      </div>
      <div className='flex justify-between text-[11px] font-bold font-mono'>
        <span className='text-green-700'>85% ON_TIME</span>
        <span className='text-amber-700'>10% DELAYED</span>
        <span className='text-error'>5% DEFAULT</span>
      </div>
    </div>
  );
};

export default PaymentStatusSummary;
