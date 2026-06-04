import React from 'react';

const NCBDiscountCard = ({ discount, percentage }) => {
  return (
    <div className="bg-surface border border-outline-variant rounded-xl p-md flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-md">
        <div className="w-10 h-10 rounded-lg bg-secondary-container bg-opacity-20 flex items-center justify-center text-secondary">
          <span className="material-symbols-outlined">savings</span>
        </div>
        <span className="font-body-md text-body-md text-on-surface">NCB Discount ({percentage}%)</span>
      </div>
      <span className="font-headline-md text-headline-md text-secondary">-${discount.toFixed(2)}</span>
    </div>
  );
};

export default NCBDiscountCard;
