import React from 'react';

const GuardrailList = ({ shelfUtilization, privateBrandPct }) => {
  const isShelfUtilizationOk = shelfUtilization <= 95.0;
  const isPrivateBrandOk = privateBrandPct >= 15.0;

  return (
    <div className='bg-surface-container rounded-lg p-6 border border-outline-variant/30 space-y-4'>
      <h4 className='text-sm font-bold text-on-surface uppercase tracking-wider border-b border-outline-variant pb-2'>
        Guardrail Status Checks
      </h4>
      <div className='space-y-3'>
        <div className='flex items-center justify-between p-3 bg-background rounded border border-outline-variant/20'>
          <div className='flex items-center space-x-3'>
            <span
              className={`material-symbols-outlined ${
                isShelfUtilizationOk ? 'text-green-status' : 'text-red-status'
              }`}
            >
              {isShelfUtilizationOk ? 'check_circle' : 'cancel'}
            </span>
            <div>
              <p className='text-sm font-semibold text-on-surface'>Shelf Capacity Guardrail</p>
              <p className='text-xs text-on-surface-variant'>Must not exceed 95% utilization</p>
            </div>
          </div>
          <div className='text-right'>
            <p className={`text-sm font-bold ${isShelfUtilizationOk ? 'text-green-status' : 'text-red-status'}`}>
              {shelfUtilization}%
            </p>
            <p className='text-xs text-on-surface-variant'>Limit: 95%</p>
          </div>
        </div>

        <div className='flex items-center justify-between p-3 bg-background rounded border border-outline-variant/20'>
          <div className='flex items-center space-x-3'>
            <span
              className={`material-symbols-outlined ${
                isPrivateBrandOk ? 'text-green-status' : 'text-red-status'
              }`}
            >
              {isPrivateBrandOk ? 'check_circle' : 'cancel'}
            </span>
            <div>
              <p className='text-sm font-semibold text-on-surface'>Private Brand Share Guardrail</p>
              <p className='text-xs text-on-surface-variant'>Must remain above 15% share</p>
            </div>
          </div>
          <div className='text-right'>
            <p className={`text-sm font-bold ${isPrivateBrandOk ? 'text-green-status' : 'text-red-status'}`}>
              {privateBrandPct}%
            </p>
            <p className='text-xs text-on-surface-variant'>Min: 15%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuardrailList;
