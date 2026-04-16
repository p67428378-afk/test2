import React from 'react';

const CoverageQuickView = () => {
  return (
    <section className='col-span-7 grid grid-cols-2 gap-6'>
      <div className='bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-between border-l-4 border-secondary shadow-sm'>
        <div>
          <h4 className='text-sm font-bold text-slate-400 uppercase tracking-widest mb-4'>Individual Deductible</h4>
          <p className='text-3xl font-black text-primary tracking-tighter mb-2'>$1,250 / $2,000</p>
          <div className='w-full h-2 bg-surface-container rounded-full overflow-hidden'>
            <div className='h-full bg-gradient-to-r from-primary to-primary-container' style={{ width: '62.5%' }}></div>
          </div>
        </div>
        <p className='text-xs text-on-surface-variant mt-4'>You have reached <strong>62.5%</strong> of your individual deductible for this year.</p>
      </div>
      <div className='bg-surface-container-lowest p-8 rounded-xl flex flex-col justify-between border-l-4 border-tertiary shadow-sm'>
        <div>
          <h4 className='text-sm font-bold text-slate-400 uppercase tracking-widest mb-4'>Out of Pocket Max</h4>
          <p className='text-3xl font-black text-primary tracking-tighter mb-2'>$840 / $6,500</p>
          <div className='w-full h-2 bg-surface-container rounded-full overflow-hidden'>
            <div className='h-full bg-gradient-to-r from-tertiary to-tertiary-container' style={{ width: '13%' }}></div>
          </div>
        </div>
        <p className='text-xs text-on-surface-variant mt-4'>Great health management! You've only used <strong>13%</strong> of your OOP maximum.</p>
      </div>
      <div className='col-span-2 bg-surface-container-lowest rounded-xl p-6 flex items-center justify-between shadow-sm'>
        <div className='flex items-center gap-6'>
          <div className='p-4 bg-teal-50 rounded-lg'>
            <span className='material-symbols-outlined text-primary text-3xl'>medical_information</span>
          </div>
          <div>
            <h4 className='font-bold text-primary'>Need a Doctor?</h4>
            <p className='text-sm text-slate-500'>Access our curated network of top-rated providers.</p>
          </div>
        </div>
        <button className='px-6 py-3 border border-outline-variant/30 rounded-lg text-primary font-bold hover:bg-primary-fixed/20 transition-all'>
          Find a Provider
        </button>
      </div>
    </section>
  );
};

export default CoverageQuickView;
