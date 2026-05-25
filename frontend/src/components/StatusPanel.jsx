
import React from 'react';

const StatusPanel = () => {
  return (
    <div className='col-span-12 lg:col-span-4 flex flex-col gap-6'>
      <div className='bg-surface-container-lowest p-8 rounded-xl border-l-4 border-error flex flex-col justify-between h-full min-h-[320px]'>
        <div>
          <span className='text-[10px] font-headline uppercase tracking-[0.2em] text-on-surface-variant'>Current Status</span>
          <div className='mt-4 flex items-center gap-4'>
            <div className='w-16 h-16 bg-error-container text-error rounded-full flex items-center justify-center'>
              <span className='material-symbols-outlined text-4xl' style={{fontVariationSettings: '\'FILL\' 1'}}>warning</span>
            </div>
            <div>
              <h2 className='text-3xl font-headline font-extrabold text-error'>FLAGGED</h2>
              <p className='text-on-surface-variant text-sm font-medium'>Risk Score: 78/100 (Critical)</p>
            </div>
          </div>
        </div>
        <div className='bg-surface-container-low p-4 rounded-lg mt-6'>
          <p className='text-sm font-semibold text-primary mb-2'>Automated Risk Alerts:</p>
          <ul className='text-xs space-y-2 text-on-surface-variant pb-2'>
            <li className='flex items-center gap-2'><span className='w-1.5 h-1.5 bg-error rounded-full'></span> PAN Database Mismatch</li>
            <li className='flex items-center gap-2'><span className='w-1.5 h-1.5 bg-error rounded-full'></span> Blurred Aadhaar Image OCR Failure</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;
