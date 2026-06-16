import React from 'react';

export default function KPIHeaderStrip({ kpis }) {
  const {
    sales_per_linear_ft = 125.50,
    private_brand_percentage = 22.5,
    in_stock_rate = 98.7,
    shelf_capacity = 85.0
  } = kpis || {};

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter'>
      {/* KPI 1 */}
      <div className='bg-surface-container-lowest border border-outline-variant rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow'>
        <div className='flex justify-between items-start'>
          <span className='font-label-bold text-label-bold text-secondary uppercase'>Sales/Linear Ft</span>
          <span className='material-symbols-outlined text-primary'>trending_up</span>
        </div>
        <div className='mt-4 flex items-end gap-2'>
          <span className='font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface'>
            ${sales_per_linear_ft.toFixed(2)}
          </span>
          <span className='font-label-bold text-label-bold text-[#146c2e] bg-[#e6f4ea] px-2 py-1 rounded-full mb-1'>
            +4.2%
          </span>
        </div>
      </div>

      {/* KPI 2 */}
      <div className='bg-surface-container-lowest border border-outline-variant rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow'>
        <div className='flex justify-between items-start'>
          <span className='font-label-bold text-label-bold text-secondary uppercase'>Private Brand %</span>
          <span className='material-symbols-outlined text-primary'>shopping_basket</span>
        </div>
        <div className='mt-4 flex items-end gap-2'>
          <span className='font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface'>
            {private_brand_percentage.toFixed(1)}%
          </span>
        </div>
        <div className='mt-1 font-label-bold text-label-bold text-secondary'>Target: &gt;20%</div>
      </div>

      {/* KPI 3 */}
      <div className='bg-surface-container-lowest border border-outline-variant rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow'>
        <div className='flex justify-between items-start'>
          <span className='font-label-bold text-label-bold text-secondary uppercase'>In-Stock Rate</span>
          <span className='material-symbols-outlined text-primary'>inventory</span>
        </div>
        <div className='mt-4 flex items-end gap-2'>
          <span className='font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface'>
            {in_stock_rate.toFixed(1)}%
          </span>
          <span className='font-label-bold text-label-bold text-[#146c2e] bg-[#e6f4ea] px-2 py-1 rounded-full mb-1'>
            Excellent
          </span>
        </div>
      </div>

      {/* KPI 4 */}
      <div className='bg-surface-container-lowest border border-outline-variant rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow'>
        <div className='flex justify-between items-start'>
          <span className='font-label-bold text-label-bold text-secondary uppercase'>Shelf Capacity</span>
          <span className='material-symbols-outlined text-primary'>view_week</span>
        </div>
        <div className='mt-4 flex items-end gap-2'>
          <span className='font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface'>
            {shelf_capacity.toFixed(1)}%
          </span>
          <span className='font-label-bold text-label-bold text-[#005a9e] bg-[#e1f0fa] px-2 py-1 rounded-full mb-1'>
            Optimal
          </span>
        </div>
      </div>
    </div>
  );
}
