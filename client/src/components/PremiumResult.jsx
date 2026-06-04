import React from 'react';

const PremiumResult = ({ premium }) => {
  return (
    <div className="bg-primary text-on-primary rounded-lg shadow-md p-lg flex flex-col items-center justify-center text-center">
      <span className="font-medium text-sm text-on-primary/80 mb-sm">Calculated Premium</span>
      <div className="font-extrabold text-3xl tracking-tight mb-2" id="premium-result">
        {premium !== null ? `$${premium.toFixed(2)}` : '-'}
      </div>
      <div className="flex items-center gap-1 text-xs text-on-primary/70">
        <span className="material-symbols-outlined text-[14px]">verified</span>
        <span>Annual Estimate</span>
      </div>
    </div>
  );
};

export default PremiumResult;
