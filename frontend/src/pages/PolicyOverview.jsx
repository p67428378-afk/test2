import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ManagementSection from '../components/ManagementSection';

const PolicyOverview = () => {
  const [policy, setPolicy] = useState(null);

  useEffect(() => {
    // Mock data for now
    const mockPolicy = {
      id: 1,
      policy_number: '#HLTH-99201-PPO',
      coverage_type: 'Gold Premium PPO',
      premium_amount: 450.0,
      effective_date: '2024-01-01',
      expiration_date: '2024-12-31',
      deductible_met: 3750,
      deductible_total: 5000,
      beneficiaries: [
        { name: 'Elena Jameson', relationship: 'Spouse', allocation: '50%', initials: 'EJ' },
        { name: 'Arthur Jameson', relationship: 'Child', allocation: '50%', initials: 'AJ' },
      ],
    };
    setPolicy(mockPolicy);
  }, []);

  if (!policy) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <header className='flex justify-between items-end mb-12'>
        <div>
          <h1 className='text-display-lg text-4xl font-black text-on-surface tracking-tight mb-2'>Policy Overview</h1>
          <div className='flex items-center gap-4'>
            <span className='inline-flex items-center gap-2 bg-secondary-container px-4 py-1.5 rounded-full text-on-secondary-container text-sm font-semibold'>
              <span className='w-2 h-2 rounded-full bg-secondary animate-pulse'></span>
              Active Coverage
            </span>
            <p className='text-slate-500 font-body'>Policy ID: <span className='font-semibold text-on-surface'>{policy.policy_number}</span></p>
          </div>
        </div>
        <div className='flex gap-4'>
          <button className='bg-surface-container-lowest border border-outline-variant/30 text-primary font-bold px-6 py-3 rounded-xl hover:bg-surface-container-low transition-all'>
            Download ID Card
          </button>
          <button className='bg-gradient-to-r from-secondary to-secondary-container text-on-secondary font-bold px-6 py-3 rounded-xl hover:opacity-90 transition-all'>
            File a Claim
          </button>
        </div>
      </header>

      <div className='grid grid-cols-12 gap-8'>
        <section className='col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl p-8 shadow-sm'>
          <div className='flex justify-between items-start mb-10'>
            <h2 className='text-2xl font-extrabold text-on-surface'>{policy.coverage_type}</h2>
            <div className='text-right'>
              <p className='text-slate-500 text-sm uppercase tracking-widest font-bold'>Monthly Premium</p>
              <p className='text-3xl font-black text-sky-900 tracking-tighter'>${policy.premium_amount.toFixed(2)}</p>
            </div>
          </div>
          <div className='grid grid-cols-3 gap-12 mb-10'>
            <div>
              <p className='text-slate-400 text-xs font-bold uppercase mb-2'>Effective Period</p>
              <p className='text-on-surface font-semibold'>{policy.effective_date} — {policy.expiration_date}</p>
            </div>
            <div>
              <p className='text-slate-400 text-xs font-bold uppercase mb-2'>Network Type</p>
              <p className='text-on-surface font-semibold'>Preferred Provider Org.</p>
            </div>
            <div>
              <p className='text-slate-400 text-xs font-bold uppercase mb-2'>Deductible Met</p>
              <div className='w-full bg-surface-container-high h-2 rounded-full mt-2'>
                <div className='bg-secondary w-3/4 h-full rounded-full'></div>
              </div>
              <p className='text-xs text-right mt-1 font-bold text-secondary'>${policy.deductible_met} / ${policy.deductible_total}</p>
            </div>
          </div>
          <div className='pt-8 border-t border-outline-variant/10'>
            <h3 className='text-lg font-bold text-on-surface mb-4'>Designated Beneficiaries</h3>
            <div className='flex flex-wrap gap-4'>
              {policy.beneficiaries.map((beneficiary, index) => (
                <div key={index} className='flex items-center gap-3 bg-surface-container-low px-4 py-3 rounded-xl'>
                  <div className='w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold text-xs'>{beneficiary.initials}</div>
                  <div>
                    <p className='text-sm font-bold text-on-surface'>{beneficiary.name}</p>
                    <p className='text-xs text-slate-500'>{beneficiary.relationship} ({beneficiary.allocation})</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className='mt-10 flex justify-end'>
            <button className='text-primary font-bold text-sm flex items-center gap-2 hover:underline'>
              View Full Terms & Conditions <span className='material-symbols-outlined text-sm'>arrow_forward</span>
            </button>
          </div>
        </section>

        <aside className='col-span-12 lg:col-span-4 space-y-8'>
          <div className='bg-surface-container-high/50 p-8 rounded-xl'>
            <h3 className='font-black text-sky-900 mb-4'>Policy Health Score</h3>
            <div className='relative h-48 flex items-center justify-center'>
              <svg className='w-32 h-32 transform -rotate-90'>
                <circle className='text-surface-container-highest' cx='64' cy='64' fill='transparent' r='58' stroke='currentColor' strokeWidth='12'></circle>
                <circle className='text-secondary' cx='64' cy='64' fill='transparent' r='58' stroke='currentColor' strokeDasharray='364.4' strokeDashoffset='91.1' strokeWidth='12'></circle>
              </svg>
              <span className='absolute text-3xl font-black text-on-surface'>75%</span>
            </div>
            <p className='text-center text-sm text-slate-600 font-medium'>Your coverage is optimized for 2024 healthcare costs.</p>
          </div>
          <div className='bg-white p-8 rounded-xl shadow-sm border border-error-container/20'>
            <h3 className='font-bold text-on-surface mb-2'>Critical Actions</h3>
            <p className='text-sm text-slate-500 mb-6 leading-relaxed'>Changes to your policy may impact your coverage stability and tax liabilities.</p>
            <button className='w-full py-3 px-4 border-2 border-error text-error font-bold rounded-xl hover:bg-error/5 transition-all text-sm flex items-center justify-center gap-2'>
              <span className='material-symbols-outlined text-lg'>cancel</span>
              Cancel Policy
            </button>
          </div>
        </aside>
        <ManagementSection />
      </div>
    </>
  );
};

export default PolicyOverview;
