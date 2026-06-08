import React from 'react';

export default function KPIBar({ kpis }) {
  const sales = kpis?.sales_per_linear_ft ?? 145.5;
  const privateBrand = kpis?.private_brand_pct ?? 18.5;
  const inStock = kpis?.in_stock_rate ?? 94.2;
  const shelfCapacity = kpis?.shelf_capacity_utilized ?? 88.0;

  return (
    <section aria-label='Key Performance Indicators' className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter'>
      <div className='bg-surface-container-lowest border border-surface-variant rounded-lg p-md shadow-sm flex flex-col justify-between hover:bg-surface-container-low transition-colors group'>
        <div className='flex justify-between items-start mb-2'>
          <h3 className='font-label-md text-label-md text-on-surface-variant uppercase tracking-wider'>Sales per Linear Foot</h3>
          <span className='material-symbols-outlined text-outline'>straighten</span>
        </div>
        <div className='flex items-end justify-between'>
          <div className='font-headline-lg text-headline-lg text-on-surface'>${sales.toFixed(2)}</div>
          <div className='flex items-center text-[#166534] bg-[#DCFCE7] px-2 py-1 rounded font-label-sm text-label-sm mb-1'>
            <span className='material-symbols-outlined text-[14px] mr-1'>trending_up</span>
            +5.2%
          </div>
        </div>
      </div>

      <div className='bg-surface-container-lowest border border-surface-variant rounded-lg p-md shadow-sm flex flex-col justify-between hover:bg-surface-container-low transition-colors group'>
        <div className='flex justify-between items-start mb-2'>
          <h3 className='font-label-md text-label-md text-on-surface-variant uppercase tracking-wider'>Private Brand %</h3>
          <span className='material-symbols-outlined text-outline'>storefront</span>
        </div>
        <div className='flex items-end justify-between'>
          <div className='font-headline-lg text-headline-lg text-on-surface'>{privateBrand.toFixed(1)}%</div>
          <div className='flex items-center text-on-surface-variant font-label-sm text-label-sm mb-1'>
            Target: &gt;15.0%
            <span className='material-symbols-outlined text-[#166534] text-[16px] ml-1'>check_circle</span>
          </div>
        </div>
      </div>

      <div className='bg-surface-container-lowest border border-surface-variant rounded-lg p-md shadow-sm flex flex-col justify-between hover:bg-surface-container-low transition-colors group'>
        <div className='flex justify-between items-start mb-2'>
          <h3 className='font-label-md text-label-md text-on-surface-variant uppercase tracking-wider'>In-Stock Rate</h3>
          <span className='material-symbols-outlined text-outline'>inventory</span>
        </div>
        <div className='flex items-end justify-between'>
          <div className='font-headline-lg text-headline-lg text-on-surface'>{inStock.toFixed(1)}%</div>
          <div className='flex items-center text-on-surface-variant font-label-sm text-label-sm mb-1'>
            Target: &gt;95.0%
            <span className='material-symbols-outlined text-[#166534] text-[16px] ml-1'>check_circle</span>
          </div>
        </div>
      </div>

      <div className='bg-surface-container-lowest border border-surface-variant rounded-lg p-md shadow-sm flex flex-col justify-between hover:bg-surface-container-low transition-colors group'>
        <div className='flex justify-between items-start mb-2'>
          <h3 className='font-label-md text-label-md text-on-surface-variant uppercase tracking-wider'>Shelf Capacity Utilized</h3>
          <span className='material-symbols-outlined text-outline'>shelves</span>
        </div>
        <div className='flex items-end justify-between'>
          <div className='font-headline-lg text-headline-lg text-on-surface'>{shelfCapacity.toFixed(1)}%</div>
          <div className='flex items-center text-on-surface-variant font-label-sm text-label-sm mb-1'>
            Limit: 95.0%
            <span className='material-symbols-outlined text-[#166534] text-[16px] ml-1'>check_circle</span>
          </div>
        </div>
      </div>
    </section>
  );
}