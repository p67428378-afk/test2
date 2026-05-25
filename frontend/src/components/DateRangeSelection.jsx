import React from 'react';

const DateRangeSelection = () => {
  return (
    <section className='mb-8'>
      <h3 className='font-headline text-lg font-bold text-primary mb-4'>Select Period</h3>
      <div className='grid grid-cols-2 gap-4'>
        <div className='flex flex-col gap-2'>
          <label className='font-label text-xs font-semibold text-on-surface-variant ml-1'>START DATE</label>
          <div className='bg-surface-container-highest rounded-xl p-4 flex items-center justify-between'>
            <span className='text-on-surface font-medium'>01 Oct 2023</span>
            <span className='material-symbols-outlined text-primary'>calendar_today</span>
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          <label className='font-label text-xs font-semibold text-on-surface-variant ml-1'>END DATE</label>
          <div className='bg-surface-container-highest rounded-xl p-4 flex items-center justify-between'>
            <span className='text-on-surface font-medium'>31 Oct 2023</span>
            <span className='material-symbols-outlined text-primary'>calendar_today</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DateRangeSelection;
