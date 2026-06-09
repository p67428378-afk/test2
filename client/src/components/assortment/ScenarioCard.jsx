import React from 'react';

const ScenarioCard = ({ scenario, isSelected, onSelect }) => {
  const { name, projected_sales, change_in_private_brand_pct, shelf_utilization_pct } = scenario;

  return (
    <div
      onClick={onSelect}
      className={`bg-surface-container rounded-lg p-6 border transition-all duration-200 cursor-pointer flex flex-col justify-between h-[240px] ${
        isSelected
          ? 'border-primary-container ring-1 ring-primary-container shadow-lg shadow-primary-container/10'
          : 'border-outline-variant/30 hover:border-outline-variant/60'
      }`}
    >
      <div>
        <div className='flex justify-between items-center mb-4'>
          <h4 className='text-lg font-bold text-on-surface'>{name}</h4>
          {isSelected && (
            <span className='bg-primary-container/15 text-primary-container border border-primary-container/30 text-xs px-2 py-0.5 rounded-full font-semibold'>
              Selected
            </span>
          )}
        </div>
        <div className='space-y-3'>
          <div className='flex justify-between items-center'>
            <span className='text-xs text-on-surface-variant'>Projected Sales</span>
            <span className='text-sm font-bold text-on-surface'>${projected_sales.toLocaleString()}</span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='text-xs text-on-surface-variant'>Private Brand Change</span>
            <span className={`text-sm font-bold ${change_in_private_brand_pct >= 0 ? 'text-green-status' : 'text-red-status'}`}>
              {change_in_private_brand_pct >= 0 ? '+' : ''}{change_in_private_brand_pct}%
            </span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='text-xs text-on-surface-variant'>Shelf Utilization</span>
            <span className={`text-sm font-bold ${shelf_utilization_pct > 95 ? 'text-red-status' : 'text-on-surface'}`}>
              {shelf_utilization_pct}%
            </span>
          </div>
        </div>
      </div>
      <div className='mt-4'>
        <div className='w-full bg-surface-variant h-1.5 rounded-full overflow-hidden'>
          <div
            className={`h-full transition-all duration-500 ${
              shelf_utilization_pct > 95 ? 'bg-red-status' : 'bg-primary-container'
            }`}
            style={{ width: `${Math.min(100, shelf_utilization_pct)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioCard;
