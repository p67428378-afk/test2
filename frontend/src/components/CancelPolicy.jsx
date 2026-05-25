
import React from 'react';
import { cancelPolicy } from '../services/api';

const CancelPolicy = () => {
  const handleCancel = () => {
    // Hardcoded policy id for now
    const policyId = 'some-policy-id';
    cancelPolicy(policyId).then(() => {
      alert('Policy cancellation initiated.');
    });
  };

  return (
    <section className='flex-shrink-0 w-[450px]'>
      <div className='bg-surface-container-low rounded-full h-[600px] p-10 flex flex-col border border-outline-variant/10'>
        <div className='w-16 h-16 bg-tertiary-fixed rounded-2xl flex items-center justify-center mb-8'>
          <span className='material-symbols-outlined text-tertiary text-3xl'>warning</span>
        </div>
        <h3 className='text-2xl font-extrabold text-on-surface mb-4'>Policy Termination</h3>
        <p className='text-on-surface-variant mb-8 leading-relaxed'>We are sorry to see you go. Please review the following terms carefully before proceeding with a cancellation request.</p>
        <div className='space-y-6 flex-grow'>
          <div className='flex gap-4'>
            <span className='material-symbols-outlined text-tertiary-container mt-1'>info</span>
            <div>
              <p className='text-sm font-bold text-on-surface'>30-Day Notice Period</p>
              <p className='text-xs text-on-surface-variant'>Cancellation requests take 30 days to process. Your coverage remains active until then.</p>
            </div>
          </div>
          <div className='flex gap-4'>
            <span className='material-symbols-outlined text-tertiary-container mt-1'>payments</span>
            <div>
              <p className='text-sm font-bold text-on-surface'>Final Premium Balance</p>
              <p className='text-xs text-on-surface-variant'>Any outstanding balances will be pro-rated and charged to your primary payment method.</p>
            </div>
          </div>
          <div className='flex gap-4'>
            <span className='material-symbols-outlined text-tertiary-container mt-1'>history_edu</span>
            <div>
              <p className='text-sm font-bold text-on-surface'>Loss of Benefits</p>
              <p className='text-xs text-on-surface-variant'>All accumulated wellness credits and Platinum-tier bonuses will be permanently forfeited.</p>
            </div>
          </div>
        </div>
        <div className='mt-auto'>
          <button onClick={handleCancel} className='w-full py-4 text-tertiary font-black border-2 border-tertiary/20 rounded-xl hover:bg-tertiary hover:text-white transition-all duration-300'>
            Initiate Cancellation
          </button>
          <p className='text-[10px] text-center text-on-surface-variant mt-4'>Need help deciding? <a className='text-primary font-bold underline' href='#'>Talk to a Coverage Advisor</a></p>
        </div>
      </div>
    </section>
  );
};

export default CancelPolicy;
