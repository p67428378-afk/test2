import React, { useState } from 'react';

const LoanForm = ({ onCheckEligibility }) => {
  const [creditScore, setCreditScore] = useState('');
  const [annualIncome, setAnnualIncome] = useState('');
  const [monthlyDebts, setMonthlyDebts] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCheckEligibility({ 
      credit_score: parseInt(creditScore),
      annual_income: parseFloat(annualIncome),
      monthly_debts: parseFloat(monthlyDebts)
    });
  };

  return (
    <section className='grid grid-cols-1 gap-4'>
      <div className='bg-surface-container-lowest p-6 rounded-xl shadow-[0px_12px_32px_rgba(17,28,45,0.06)] space-y-6'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <label className='font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant'>Credit Score (300-850)</label>
            <div className='relative'>
              <input 
                className='w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-fixed-dim/40 outline-none transition-all placeholder:text-outline-variant/60 font-medium' 
                placeholder='e.g. 740' 
                type='number' 
                value={creditScore} 
                onChange={(e) => setCreditScore(e.target.value)} 
                required 
              />
              <span className='absolute right-4 top-3 text-on-surface-variant'>
                <span className='material-symbols-outlined text-lg'>speed</span>
              </span>
            </div>
          </div>
          <div className='space-y-2'>
            <label className='font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant'>Annual Income ($)</label>
            <div className='relative'>
              <input 
                className='w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-fixed-dim/40 outline-none transition-all placeholder:text-outline-variant/60 font-medium' 
                placeholder='e.g. 85,000' 
                type='number' 
                value={annualIncome} 
                onChange={(e) => setAnnualIncome(e.target.value)} 
                required 
              />
              <span className='absolute right-4 top-3 text-on-surface-variant'>
                <span className='material-symbols-outlined text-lg'>monetization_on</span>
              </span>
            </div>
          </div>
          <div className='space-y-2'>
            <label className='font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant'>Monthly Debts ($)</label>
            <div className='relative'>
              <input 
                className='w-full bg-surface-container-low border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-primary-fixed-dim/40 outline-none transition-all placeholder:text-outline-variant/60 font-medium' 
                placeholder='e.g. 450' 
                type='number' 
                value={monthlyDebts} 
                onChange={(e) => setMonthlyDebts(e.target.value)} 
                required 
              />
              <span className='absolute right-4 top-3 text-on-surface-variant'>
                <span className='material-symbols-outlined text-lg'>credit_card</span>
              </span>
            </div>
          </div>
          <button type='submit' className='w-full bg-primary text-on-primary font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all'>
            <span>Check Eligibility</span>
            <span className='material-symbols-outlined text-lg'>analytics</span>
          </button>
        </form>
      </div>
    </section>
  );
};

export default LoanForm;
