import React from 'react';

const ComplianceRadar = () => {
  return (
    <div className='bg-surface-container-highest p-6 rounded-xl flex flex-col items-center justify-center text-center'>
      <h2 className='text-[14px] font-bold text-on-surface uppercase tracking-widest mb-6 headline w-full text-left'>Compliance Radar</h2>
      <div className='relative w-48 h-48 border-[12px] border-secondary-container/20 rounded-full flex items-center justify-center mb-6'>
        <div className='absolute inset-0 border-8 border-secondary-container border-t-transparent rounded-full rotate-45'></div>
        <div className='text-3xl font-black text-primary'>AA+</div>
      </div>
      <div className='space-y-3 w-full'>
        <div className='flex justify-between items-center bg-white/50 p-2 rounded-lg'>
          <span className='text-[11px] font-bold text-slate-600'>RBI Guidelines</span>
          <span className='text-[11px] font-bold text-green-600 flex items-center gap-1'>
            <span className='material-symbols-outlined text-[14px]'>check_circle</span> PASS
          </span>
        </div>
        <div className='flex justify-between items-center bg-white/50 p-2 rounded-lg'>
          <span className='text-[11px] font-bold text-slate-600'>Basel III Norms</span>
          <span className='text-[11px] font-bold text-green-600 flex items-center gap-1'>
            <span className='material-symbols-outlined text-[14px]'>check_circle</span> COMPLIANT
          </span>
        </div>
        <div className='flex justify-between items-center bg-white/50 p-2 rounded-lg'>
          <span className='text-[11px] font-bold text-slate-600'>KFS Disclosure</span>
          <span className='text-[11px] font-bold text-amber-600 flex items-center gap-1'>
            <span className='material-symbols-outlined text-[14px]'>refresh</span> PENDING 2%
          </span>
        </div>
      </div>
    </div>
  );
};

export default ComplianceRadar;
