import React from 'react';

const MarketOverviewChart = () => {
  // This is a static representation. In a real app, you'd use a charting library.
  return (
    <div className='bg-surface-container-lowest border border-outline-variant rounded-lg p-4 h-full flex flex-col shadow-sm'>
      <h3 className='font-title-sm text-base text-on-surface mb-4'>Market Index Performance</h3>
      <div className='flex-1 flex items-center justify-center'>
        <p className='text-on-surface-variant'>Chart would be here</p>
      </div>
    </div>
  );
};

export default MarketOverviewChart;
