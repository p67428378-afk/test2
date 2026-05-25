import React from 'react';

const ComplianceMonitoring = () => {
  return (
    <div className='col-span-12 lg:col-span-6 space-y-6'>
      <h3 className='text-xl font-bold font-headline'>Compliance Monitoring</h3>
      <div className='grid grid-cols-2 gap-4'>
        <div className='bg-surface-container-lowest p-6 risk-ribbon-success'>
          <div className='flex justify-between items-start mb-4'>
            <span className='text-[10px] font-bold text-on-surface-variant uppercase tracking-widest'>Single Stock Limit</span>
            <span className='px-2 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded'>Compliant</span>
          </div>
          <div className='text-2xl font-bold'>14.2%</div>
          <div className='text-xs text-on-surface-variant mt-1'>Limit: 15.0% (Reliance Ind.)</div>
        </div>
        <div className='bg-surface-container-lowest p-6 risk-ribbon-error'>
          <div className='flex justify-between items-start mb-4'>
            <span className='text-[10px] font-bold text-on-surface-variant uppercase tracking-widest'>Sectoral Limit</span>
            <span className='px-2 py-1 bg-error-container text-on-error-container text-[10px] font-bold rounded'>Violation</span>
          </div>
          <div className='text-2xl font-bold'>28.5%</div>
          <div className='text-xs text-on-surface-variant mt-1'>Limit: 25.0% (IT Services)</div>
        </div>
        <div className='bg-surface-container-lowest p-6 risk-ribbon-success'>
          <div className='flex justify-between items-start mb-4'>
            <span className='text-[10px] font-bold text-on-surface-variant uppercase tracking-widest'>G-Sec Exposure</span>
            <span className='px-2 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded'>Compliant</span>
          </div>
          <div className='text-2xl font-bold'>62.1%</div>
          <div className='text-xs text-on-surface-variant mt-1'>Min Threshold: 50.0%</div>
        </div>
        <div className='bg-surface-container-lowest p-6 risk-ribbon-warning'>
          <div className='flex justify-between items-start mb-4'>
            <span className='text-[10px] font-bold text-on-surface-variant uppercase tracking-widest'>Foreign Assets</span>
            <span className='px-2 py-1 bg-tertiary-container text-on-tertiary-container text-[10px] font-bold rounded'>Buffer low</span>
          </div>
          <div className='text-2xl font-bold'>19.2%</div>
          <div className='text-xs text-on-surface-variant mt-1'>Limit: 20.0% Max</div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceMonitoring;
