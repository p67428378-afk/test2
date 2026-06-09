import React from 'react';

export default function KPIHeaderStrip({ kpis }) {
  const salesPerLinearFt = kpis?.sales_per_linear_ft ?? 425.50;
  const privateBrandPct = kpis?.private_brand_pct ?? 24.5;
  const inStockRate = kpis?.in_stock_rate ?? 96.8;
  const shelfCapacity = kpis?.shelf_capacity ?? 92;

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-stack-md mb-stack-lg'>
      {/* Sales per Linear Ft */}
      <div className='bg-surface-container-lowest p-stack-md rounded-lg border border-outline-variant shadow-sm'>
        <div className='flex justify-between items-start mb-2'>
          <span className='text-label-md text-secondary uppercase tracking-wider'>Sales per Linear Ft</span>
          <span className='bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1'>
            <span className='material-symbols-outlined text-[12px]'>trending_up</span> +8.2%
          </span>
        </div>
        <p className='text-headline-md font-headline-md text-on-surface'>
          ${salesPerLinearFt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <div className='mt-3 w-full h-1.5 bg-surface-container rounded-full overflow-hidden'>
          <div className='bg-primary-container h-full w-[85%]'></div>
        </div>
      </div>

      {/* Private Brand % */}
      <div className='bg-surface-container-lowest p-stack-md rounded-lg border border-outline-variant shadow-sm'>
        <div className='flex justify-between items-start mb-2'>
          <span className='text-label-md text-secondary uppercase tracking-wider'>Private Brand %</span>
          <span className='bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full'>Target: 25.0%</span>
        </div>
        <p className='text-headline-md font-headline-md text-on-surface'>
          {privateBrandPct.toFixed(1)}%
        </p>
        <div className='mt-3 w-full h-1.5 bg-surface-container rounded-full overflow-hidden'>
          <div className='bg-yellow-400 h-full w-[98%]'></div>
        </div>
      </div>

      {/* In-Stock Rate */}
      <div className='bg-surface-container-lowest p-stack-md rounded-lg border border-outline-variant shadow-sm'>
        <div className='flex justify-between items-start mb-2'>
          <span className='text-label-md text-secondary uppercase tracking-wider'>In-Stock Rate</span>
          <span className='bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full'>Target: 95.0%</span>
        </div>
        <p className='text-headline-md font-headline-md text-on-surface'>
          {inStockRate.toFixed(1)}%
        </p>
        <div className='mt-3 w-full h-1.5 bg-surface-container rounded-full overflow-hidden'>
          <div className='bg-green-500 h-full w-full'></div>
        </div>
      </div>

      {/* Shelf Capacity */}
      <div className='bg-surface-container-lowest p-stack-md rounded-lg border border-outline-variant shadow-sm'>
        <div className='flex justify-between items-start mb-2'>
          <span className='text-label-md text-secondary uppercase tracking-wider'>Shelf Capacity</span>
          <span className='bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full'>Optimal</span>
        </div>
        <p className='text-headline-md font-headline-md text-on-surface'>
          {shelfCapacity}%
        </p>
        <p className='text-label-sm text-secondary mt-1'>828 / 900 linear inches used</p>
      </div>
    </div>
  );
}
