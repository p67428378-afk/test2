import React from 'react';

const CancelPolicy = () => {
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel your policy?')) {
      // Handle cancellation logic here
      console.log('Policy cancelled');
    }
  };

  return (
    <main className='pt-24 px-6 max-w-2xl mx-auto'>
      <div className='mb-12'>
        <span className='text-tertiary font-bold tracking-widest text-xs uppercase mb-4 block'>Action Required</span>
        <h1 className='text-4xl md:text-5xl font-extrabold text-on-surface tracking-tight leading-tight'>Loss of Coverage</h1>
        <p className='mt-6 text-lg text-on-surface-variant leading-relaxed font-light'>
          We understand that circumstances change. However, cancelling your policy means ending your protection today. Please review the implications carefully.
        </p>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-8'>
        <div className='md:col-span-2 bg-surface-container-low p-8 rounded-xl border-l-4 border-tertiary'>
          <div className='flex items-start gap-4'>
            <span className='material-symbols-outlined text-tertiary text-3xl'>warning</span>
            <div>
              <h3 className='text-xl font-bold text-on-surface mb-2'>Immediate Cessation</h3>
              <p className='text-on-surface-variant text-sm leading-relaxed'>
                Your active coverage for <span className='font-bold text-on-surface'>Health Shield Plus</span> will terminate at 11:59 PM tonight. Any incidents occurring after this time will not be covered.
              </p>
            </div>
          </div>
        </div>
        <div className='bg-surface-container-lowest p-6 rounded-xl flex flex-col gap-3'>
          <span className='material-symbols-outlined text-primary text-2xl'>history</span>
          <h4 className='font-bold text-on-surface'>Grace Periods</h4>
          <p className='text-xs text-on-surface-variant leading-relaxed'>
            Most providers require a 90-day waiting period for new enrollments. Re-activating later may result in higher premiums.
          </p>
        </div>
        <div className='bg-surface-container-lowest p-6 rounded-xl flex flex-col gap-3'>
          <span className='material-symbols-outlined text-primary text-2xl'>receipt_long</span>
          <h4 className='font-bold text-on-surface'>Claims Impact</h4>
          <p className='text-xs text-on-surface-variant leading-relaxed'>
            Unfiled claims must be submitted within 48 hours of cancellation to be considered for reimbursement.
          </p>
        </div>
      </div>
      <div className='relative overflow-hidden rounded-xl mb-12 p-1 bg-gradient-to-br from-primary to-primary-container'>
        <div className='bg-surface-container-lowest/95 backdrop-blur-md p-8 rounded-[calc(0.75rem-1px)]'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-6'>
            <div>
              <p className='text-xs font-bold text-primary tracking-widest uppercase mb-1'>Calculated Return</p>
              <h2 className='text-3xl font-extrabold text-on-surface'>Prorated Refund</h2>
              <p className='text-sm text-on-surface-variant mt-2'>Calculated based on 18 unused days this cycle.</p>
            </div>
            <div className='text-center md:text-right'>
              <span className='text-5xl font-black text-primary'>$142.50</span>
              <div className='mt-2 inline-flex items-center gap-1 px-3 py-1 bg-surface-container-high rounded-full text-[10px] font-bold text-secondary uppercase tracking-tighter'>
                <span className='material-symbols-outlined text-sm'>check_circle</span>
                Verified Amount
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col gap-4 mb-16'>
        <button className='w-full py-5 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-xl text-lg hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95'>
          Keep My Policy
        </button>
        <button onClick={handleCancel} className='w-full py-5 bg-surface-container-highest text-on-secondary-container font-semibold rounded-xl text-lg hover:bg-surface-dim transition-colors active:scale-95'>
          Confirm Cancellation
        </button>
        <p className='text-center text-xs text-on-surface-variant px-8 leading-relaxed italic'>
          By confirming, you acknowledge that Cerulean Shield is no longer liable for medical expenses incurred after the effective date.
        </p>
      </div>
    </main>
  );
};

export default CancelPolicy;
