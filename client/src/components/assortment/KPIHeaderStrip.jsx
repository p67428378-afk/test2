import React from 'react';

export default function KPIHeaderStrip({ kpis }) {
  const sales = kpis?.sales_per_linear_ft ? `$${kpis.sales_per_linear_ft.toLocaleString()}` : '$1,500';
  const pb = kpis?.private_brand_pct ? `${kpis.private_brand_pct}%` : '25.0%';
  const inStock = kpis?.in_stock_rate ? `${kpis.in_stock_rate}%` : '95.0%';
  const capacity = kpis?.shelf_capacity ? `${kpis.shelf_capacity}%` : '85.0%';

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-lg'>
      {/* KPI 1 */}
      <div className='bg-surface-container-lowest rounded-lg p-lg shadow-level-1 border border-outline-variant/30 flex flex-col justify-between'>
        <div className='text-sm text-on-surface-variant font-medium mb-2'>Sales per Linear Foot</div>
        <div className='flex items-end justify-between'>
          <div className='font-headline-md text-headline-md font-bold text-on-surface'>{sales}</div>
          <div className='flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold'>
            <span className='material-symbols-outlined text-[14px]'>trending_up</span>
            +4.2% vs last Q
          </div>
        </div>
      </div>

      {/* KPI 2 */}
      <div className='bg-surface-container-lowest rounded-lg p-lg shadow-level-1 border border-outline-variant/30 flex flex-col justify-between'>
        <div className='text-sm text-on-surface-variant font-medium mb-2'>Private Brand %</div>
        <div className='flex items-end justify-between'>
          <div className='font-headline-md text-headline-md font-bold text-on-surface'>{pb}</div>
          <div className='flex items-center gap-1 bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-bold'>
            Target: 25.0%
          </div>
        </div>
      </div>

      {/* KPI 3 */}
      <div className='bg-surface-container-lowest rounded-lg p-lg shadow-level-1 border border-outline-variant/30 flex flex-col justify-between'>
        <div className='text-sm text-on-surface-variant font-medium mb-2'>In-Stock Rate</div>
        <div className='flex items-end justify-between'>
          <div className='font-headline-md text-headline-md font-bold text-on-surface'>{inStock}</div>
          <div className='flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold'>
            Target: 95.0%
          </div>
        </div>
      </div>

      {/* KPI 4 */}
      <div className='bg-surface-container-lowest rounded-lg p-lg shadow-level-1 border border-outline-variant/30 flex flex-col justify-between'>
        <div className='text-sm text-on-surface-variant font-medium mb-2'>Shelf Capacity</div>
        <div className='flex items-end justify-between'>
          <div className='font-headline-md text-headline-md font-bold text-on-surface'>{capacity}</div>
          <div className='flex items-center gap-1 bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold'>
            Max: 100%
          </div>
        </div>
      </div>
    </div>
  );
}
