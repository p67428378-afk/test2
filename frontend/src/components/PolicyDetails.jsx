import React, { useState, useEffect } from 'react';
import { getPolicy } from '../services/api';

const PolicyDetails = () => {
  const [policy, setPolicy] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPolicy('policy-123')
      .then(response => {
        setPolicy(response.data);
      })
      .catch(error => {
        setError('Error fetching policy details');
        console.error('Error fetching policy details:', error);
      });
  }, []);

  if (error) {
    return <div className='text-red-500'>{error}</div>;
  }

  if (!policy) {
    return <div>Loading...</div>;
  }

  return (
    <section className='mb-12'>
      <div className='flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8'>
        <div>
          <span className='text-secondary font-bold tracking-widest text-[10px] uppercase'>Active Coverage</span>
          <h2 className='text-5xl font-extrabold text-primary tracking-tight mt-2 mb-1'>{policy.policy_type}</h2>
          <p className='text-on-surface-variant font-medium'>Policy ID: <span className='text-primary'>{policy.policy_id}</span></p>
        </div>
        <div className='flex gap-4'>
          <button className='bg-surface-container-lowest text-primary font-bold px-6 py-3 rounded-xl border border-outline-variant/15 flex items-center gap-2 hover:bg-surface-container-low transition-colors'>
            <span className='material-symbols-outlined text-lg' data-icon='download'>download</span>
            Digital ID Card
          </button>
          <button className='vitality-gradient text-white font-bold px-8 py-3 rounded-xl shadow-lg shadow-primary/10 flex items-center gap-2 active:scale-95 transition-transform'>
            <span className='material-symbols-outlined text-lg' data-icon='share'>share</span>
            Share Benefits
          </button>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        <div className='bg-surface-container-lowest p-6 rounded-xl flex flex-col justify-between h-32'>
          <span className='text-secondary font-bold text-[10px] uppercase tracking-wider'>Effective Dates</span>
          <div className='mt-2'>
            <p className='text-lg font-bold text-primary'>{new Date(policy.effective_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} — {new Date(policy.expiration_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</p>
            <p className='text-xs text-on-surface-variant'>Coverage Year {new Date(policy.effective_date).getFullYear()}</p>
          </div>
        </div>
        <div className='bg-surface-container-lowest p-6 rounded-xl flex flex-col justify-between h-32'>
          <span className='text-secondary font-bold text-[10px] uppercase tracking-wider'>Next Premium</span>
          <div className='mt-2'>
            <p className='text-2xl font-black text-primary'>${policy.premium_amount.toFixed(2)}</p>
            <p className='text-xs text-on-surface-variant'>Due on May 15, 2024</p>
          </div>
        </div>
        <div className='bg-surface-container-lowest p-6 rounded-xl flex flex-col justify-between h-32'>
          <span className='text-secondary font-bold text-[10px] uppercase tracking-wider'>Beneficiaries</span>
          <div className='mt-2'>
            <p className='text-lg font-bold text-primary'>{policy.beneficiaries.length} Members</p>
            <div className='flex -space-x-2 mt-1'>
              {policy.beneficiaries.map((_, index) => (
                <div key={index} className={`w-6 h-6 rounded-full bg-primary-fixed-dim border-2 border-white`}></div>
              ))}
            </div>
          </div>
        </div>
        <div className='bg-secondary-container/30 p-6 rounded-xl flex flex-col justify-between h-32 relative overflow-hidden'>
          <div className='relative z-10'>
            <span className='text-on-secondary-container font-bold text-[10px] uppercase tracking-wider'>Plan Status</span>
            <div className='mt-2 flex items-center gap-2'>
              <span className={`w-2 h-2 rounded-full ${policy.status === 'Active' ? 'bg-tertiary' : 'bg-error'}`}></span>
              <p className='text-lg font-bold text-on-secondary-container'>{policy.status}</p>
            </div>
          </div>
          <span className='material-symbols-outlined absolute -bottom-2 -right-2 text-6xl text-on-secondary-container/10' data-icon='verified'>verified</span>
        </div>
      </div>
    </section>
  );
};

export default PolicyDetails;
