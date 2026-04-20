import React from 'react';

const RiskScore = () => {
  return (
    <div className='col-span-12 lg:col-span-7 bg-surface-container-lowest p-8 flex flex-col md:flex-row gap-12 items-center risk-ribbon-warning'>
      <div className='relative w-64 h-64 flex items-center justify-center'>
        <svg className='w-full h-full -rotate-90'>
          <circle className='text-surface-container-high' cx='128' cy='128' fill='transparent' r='110' stroke='currentColor' strokeWidth='16'></circle>
          <circle className='text-tertiary-container' cx='128' cy='128' fill='transparent' r='110' stroke='currentColor' strokeDasharray='691' strokeDashoffset='242' strokeWidth='16'></circle>
        </svg>
        <div className='absolute flex flex-col items-center'>
          <span className='text-6xl font-extrabold font-headline text-on-surface'>65</span>
          <span className='text-xs font-bold text-on-surface-variant tracking-widest uppercase'>Risk Score</span>
        </div>
      </div>
      <div className='flex-1 space-y-6'>
        <div>
          <h2 className='text-2xl font-bold font-headline text-on-surface'>Portfolio Vulnerability</h2>
          <p className='text-on-surface-variant text-sm mt-1 italic leading-relaxed'>Systemic risk levels are elevated due to recent tech-sector concentration and increased volatility in emerging markets.</p>
        </div>
        <div className='space-y-4'>
          <div className='flex justify-between items-end'>
            <span className='text-xs font-bold text-on-surface-variant'>Volatility</span>
            <span className='text-sm font-bold text-on-surface'>High (82/100)</span>
          </div>
          <div className='w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden'>
            <div className='h-full bg-error w-[82%]'></div>
          </div>
          <div className='flex justify-between items-end'>
            <span className='text-xs font-bold text-on-surface-variant'>Concentration</span>
            <span className='text-sm font-bold text-on-surface'>Moderate (45/100)</span>
          </div>
          <div className='w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden'>
            <div className='h-full bg-tertiary w-[45%]'></div>
          </div>
          <div className='flex justify-between items-end'>
            <span className='text-xs font-bold text-on-surface-variant'>Leverage</span>
            <span className='text-sm font-bold text-on-surface'>Low (12/100)</span>
          </div>
          <div className='w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden'>
            <div className='h-full bg-primary-container w-[12%]'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskScore;
