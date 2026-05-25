import React from 'react';

const TrustIndicators = () => {
  return (
    <div className='bg-surface-container-high rounded-xl p-6 flex flex-col items-center text-center'>
      <div className='w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm'>
        <span className='material-symbols-outlined text-primary text-3xl' style={{ fontVariationSettings: '"FILL" 1' }}>workspace_premium</span>
      </div>
      <h4 className='font-bold text-blue-900 mb-1'>HIPAA Compliant</h4>
      <p className='text-xs text-slate-500'>Your health data is protected under the strictest federal security standards.</p>
    </div>
  );
};

export default TrustIndicators;
