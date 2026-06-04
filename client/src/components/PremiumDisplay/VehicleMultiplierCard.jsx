import React from 'react';

const VehicleMultiplierCard = ({ multiplier, adjustment }) => {
    const isPositive = adjustment >= 0;
    const textColor = isPositive ? 'text-error' : 'text-secondary';
    const icon = isPositive ? 'trending_up' : 'trending_down';
    const sign = isPositive ? '+' : '-';

  return (
    <div className="bg-surface border border-outline-variant rounded-xl p-md flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-md">
        <div className={`w-10 h-10 rounded-lg ${isPositive ? 'bg-error-container' : 'bg-secondary-container'} bg-opacity-20 flex items-center justify-center ${textColor}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <span className="font-body-md text-body-md text-on-surface">Vehicle Multiplier ({multiplier}x)</span>
      </div>
      <span className={`font-headline-md text-headline-md ${textColor}`}>{sign}${Math.abs(adjustment).toFixed(2)}</span>
    </div>
  );
};

export default VehicleMultiplierCard;
