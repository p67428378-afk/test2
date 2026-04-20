import React from 'react';

const BalanceOverview = () => {
  return (
    <section className='mb-8'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='bg-surface-container-low rounded-xl p-6 relative overflow-hidden'>
          <div className='relative z-10'>
            <span className='font-label text-xs font-semibold text-on-primary-fixed-variant bg-primary-fixed px-2 py-1 rounded mb-4 inline-block'>OPENING BALANCE</span>
            <div className='flex flex-col'>
              <span className='font-headline text-3xl font-extrabold tracking-tighter text-primary'>€124,560.00</span>
              <span className='text-on-surface-variant text-xs mt-1'>As of Oct 1, 2023</span>
            </div>
          </div>
          <div className='absolute -right-4 -bottom-4 opacity-5'>
            <span className='material-symbols-outlined text-9xl'>account_balance</span>
          </div>
        </div>
        <div className='bg-surface-container-lowest rounded-xl p-6 shadow-[0_32px_64px_-12px_rgba(25,28,30,0.06)] relative overflow-hidden border border-outline-variant/20'>
          <div className='relative z-10'>
            <span className='font-label text-xs font-semibold text-on-tertiary-fixed-variant bg-tertiary-fixed px-2 py-1 rounded mb-4 inline-block'>CLOSING BALANCE</span>
            <div className='flex flex-col'>
              <span className='font-headline text-3xl font-extrabold tracking-tighter text-primary'>€142,392.50</span>
              <span className='text-on-tertiary-container text-xs mt-1 font-bold'>▲ 14.3% increase</span>
            </div>
          </div>
          <div className='absolute -right-4 -bottom-4 opacity-5'>
            <span className='material-symbols-outlined text-9xl'>trending_up</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BalanceOverview;
