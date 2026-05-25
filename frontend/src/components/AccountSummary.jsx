import React from 'react';

const AccountSummary = () => {
  return (
    <section className='mb-8 mt-4'>
      <span className='font-label text-xs font-semibold uppercase tracking-widest text-on-surface-variant opacity-60 block mb-2'>Account Summary</span>
      <div className='bg-surface-container-low rounded-xl p-1 flex items-center gap-1'>
        <div className='bg-surface-container-lowest shadow-sm rounded-lg p-4 flex-1 flex flex-col gap-1 border-l-4 border-primary'>
          <span className='font-label text-[10px] font-bold uppercase text-on-surface-variant'>Primary Account</span>
          <h2 className='font-headline font-bold text-lg text-primary'>Savings Account ••• 8829</h2>
          <p className='text-on-surface-variant text-sm'>Available: €241,082.15</p>
        </div>
      </div>
    </section>
  );
};

export default AccountSummary;
