import React from 'react';

const PolicyCancellation = () => {
  return (
    <section className='bg-error-container/30 rounded-xl p-6 border-0'>
      <div className='flex items-center gap-2 mb-4'>
        <span className='material-symbols-outlined text-error'>warning</span>
        <h3 className='font-bold text-on-error-container'>Policy Cancellation</h3>
      </div>
      <p className='text-xs text-slate-600 mb-4 leading-relaxed'>
        Cancellations requested after the 15th of the month may be subject to a $50 processing fee. Your coverage will remain active until the end of the current billing cycle.
      </p>
      <div className='space-y-2'>
        <div className='flex justify-between text-xs font-medium text-slate-500'>
          <span>Grace Period Ends:</span>
          <span className='text-on-surface'>Dec 15, 2024</span>
        </div>
      </div>
      <button className='w-full mt-6 py-2.5 rounded-lg border-2 border-error text-error text-sm font-bold hover:bg-error hover:text-white transition-all'>Request Cancellation</button>
    </section>
  );
};

export default PolicyCancellation;
