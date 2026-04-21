
import React, { useState } from 'react';

const LoanForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    credit_score: '',
    annual_income: '',
    monthly_debts: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <section className='grid grid-cols-1 gap-4'>
      <div className='bg-surface-container-lowest p-6 rounded-xl shadow-[0px_12px_32px_rgba(17,28,45,0.06)] space-y-6'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='space-y-2'>
            <label className='font-label text-xs font-semibold uppercase tracking-wider text-on-surface-variant'>Credit Score (300-850)</label>
            <div className='relative'>
              <input
                className='w-full bg-surface-container-low border-none rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-primary-fixed-dim/40 outline-none transition-all placeholder:text-outline-variant/60 font-medium'
                placeholder='e.g. 740'
                type='number'
                name='credit_score'
                value={formData.credit_score}
                onChange={handleChange}
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
                className='w-full bg-surface-container-low border-none rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-primary-fixed-dim/40 outline-none transition-all placeholder:text-outline-variant/60 font-medium'
                placeholder='e.g. 85,000'
                type='number'
                name='annual_income'
                value={formData.annual_income}
                onChange={handleChange}
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
                className='w-full bg-surface-container-low border-none rounded-lg px-4 py-3 pr-12 focus:ring-2 focus:ring-primary-fixed-dim/40 outline-none transition-all placeholder:text-outline-variant/60 font-medium'
                placeholder='e.g. 450'
                type='number'
                name='monthly_debts'
                value={formData.monthly_debts}
                onChange={handleChange}
                required
              />
              <span className='absolute right-4 top-3 text-on-surface-variant'>
                <span className='material-symbols-outlined text-lg'>credit_card</span>
              </span>
            </div>
          </div>
          <button type='submit' className='w-full bg-primary text-on-primary font-bold py-4 rounded-lg flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all'>
            <span>Check Eligibility</span>
            <span className='material-symbols-outlined text-lg'>analytics</span>
          </button>
        </form>
      </div>
    </section>
  );
};

export default LoanForm;
