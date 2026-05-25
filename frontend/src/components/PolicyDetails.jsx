import React from 'react';

const PolicyDetails = () => {
  return (
    <section className='bg-surface-container-lowest rounded-xl p-8 shadow-sm relative overflow-hidden'>
      <div className='absolute top-0 right-0 w-32 h-32 premium-gradient opacity-5 rounded-bl-full'></div>
      <div className='flex justify-between items-start mb-8'>
        <div>
          <span className='bg-primary-fixed text-on-primary-fixed text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 inline-block'>Active Plan</span>
          <h2 className='text-3xl font-bold text-blue-900'>Premier Gold PPO</h2>
          <p className='text-slate-500 font-medium'>Policy #: SV-9920-112</p>
        </div>
        <div className='text-right'>
          <p className='text-xs text-slate-400 uppercase font-bold tracking-widest mb-1'>Monthly Premium</p>
          <p className='text-3xl font-extrabold text-blue-900'>$482.50</p>
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mb-8'>
        <div className='bg-surface-container-low p-5 rounded-xl'>
          <span className='material-symbols-outlined text-primary mb-2'>calendar_today</span>
          <p className='text-xs text-slate-500 font-bold mb-1'>Effective Dates</p>
          <p className='text-sm font-semibold text-on-surface'>Jan 01, 2024 — Dec 31, 2024</p>
        </div>
        <div className='bg-surface-container-low p-5 rounded-xl'>
          <span className='material-symbols-outlined text-primary mb-2'>group</span>
          <p className='text-xs text-slate-500 font-bold mb-1'>Beneficiaries</p>
          <p className='text-sm font-semibold text-on-surface'>Alex Sterling, Sarah S. (Spouse)</p>
        </div>
        <div className='bg-surface-container-low p-5 rounded-xl'>
          <span className='material-symbols-outlined text-primary mb-2'>health_and_safety</span>
          <p className='text-xs text-slate-500 font-bold mb-1'>Network Type</p>
          <p className='text-sm font-semibold text-on-surface'>Nationwide PPO Network</p>
        </div>
      </div>
      <div>
        <h3 className='text-sm font-bold text-blue-900 mb-4 uppercase tracking-wider'>Covered Services Summary</h3>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          <div className='flex items-center gap-3 p-3 bg-white shadow-sm rounded-lg'>
            <span className='material-symbols-outlined text-primary text-xl' style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
            <span className='text-xs font-medium'>Primary Care</span>
          </div>
          <div className='flex items-center gap-3 p-3 bg-white shadow-sm rounded-lg'>
            <span className='material-symbols-outlined text-primary text-xl' style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
            <span className='text-xs font-medium'>Emergency Care</span>
          </div>
          <div className='flex items-center gap-3 p-3 bg-white shadow-sm rounded-lg'>
            <span className='material-symbols-outlined text-primary text-xl' style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
            <span className='text-xs font-medium'>Dental & Vision</span>
          </div>
          <div className='flex items-center gap-3 p-3 bg-white shadow-sm rounded-lg'>
            <span className='material-symbols-outlined text-primary text-xl' style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
            <span className='text-xs font-medium'>Specialist Visits</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PolicyDetails;
