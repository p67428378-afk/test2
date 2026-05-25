
import React, { useState } from 'react';

const PanInput = () => {
  const [panNumber, setPanNumber] = useState('');

  return (
    <section className='col-span-1 bg-surface-container-lowest p-8 rounded-xl shadow-sm space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='bg-secondary-container p-2 rounded-lg'>
            <span className='material-symbols-outlined text-secondary' data-icon='account_balance_wallet'>account_balance_wallet</span>
          </div>
          <h2 className='font-headline font-bold text-lg'>PAN Input</h2>
        </div>
        <span className='text-[10px] font-bold uppercase tracking-widest text-primary-fixed-variant bg-primary-fixed px-2 py-1 rounded'>Pending Scan</span>
      </div>
      <div className='space-y-4'>
        <div className='group'>
          <label className='text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 block'>Account Number</label>
          <input 
            className='w-full bg-surface-container-low border-none rounded-xl p-4 font-mono tracking-widest text-lg focus:ring-2 focus:ring-primary-fixed transition-all outline-none' 
            placeholder='ABCDE1234F' 
            type='text'
            value={panNumber}
            onChange={(e) => setPanNumber(e.target.value)}
          />
        </div>
        <div className='relative group'>
          <label className='text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 block'>Financial Document</label>
          <div className='border-2 border-dashed border-outline-variant bg-surface-container-low rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-container-high transition-colors'>
            <span className='material-symbols-outlined text-4xl text-outline mb-4' data-icon='add_photo_alternate'>add_photo_alternate</span>
            <p className='text-sm font-medium text-on-surface'>Click to upload PAN Card</p>
            <p className='text-xs text-on-surface-variant mt-1'>PDF, JPG or PNG (Max 5MB)</p>
          </div>
        </div>
        <div className='flex items-center gap-3 bg-primary-fixed/30 p-3 rounded-lg'>
          <span className='material-symbols-outlined text-primary' data-icon='info' style={{fontVariationSettings: '\'FILL\' 1'}}>info</span>
          <span className='text-sm font-semibold text-primary'>Awaiting document signature</span>
        </div>
      </div>
    </section>
  );
};

export default PanInput;
