import React from 'react';

export default function KPIHeaderStrip({ kpis }) {
  const {
    sales_per_linear_ft = 15.75,
    private_brand_pct = 22,
    in_stock_rate = 94,
    shelf_capacity = 85,
  } = kpis || {};

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-stack-lg'>
      {/* KPI 1 */}
      <div className='bg-surface-container-lowest border border-gray rounded-lg p-stack-lg card-shadow'>
        <div className='font-label-md text-label-md text-on-secondary-container uppercase tracking-wider mb-2'>
          Sales per Linear Ft
        </div>
        <div className='font-stats-xl text-stats-xl dark-slate mb-3'>
          ${sales_per_linear_ft.toFixed(2)}
        </div>
        <div className='inline-flex items-center px-2 py-1 rounded-full badge-green text-xs font-semibold'>
          <span className='material-symbols-outlined text-[14px] mr-1'>trending_up</span>
          +4.2% vs last month
        </div>
      </div>

      {/* KPI 2 */}
      <div className='bg-surface-container-lowest border border-gray rounded-lg p-stack-lg card-shadow'>
        <div className='font-label-md text-label-md text-on-secondary-container uppercase tracking-wider mb-2'>
          Private Brand %
        </div>
        <div className='font-stats-xl text-stats-xl dark-slate mb-3'>
          {private_brand_pct}%
        </div>
        <div className='inline-flex items-center px-2 py-1 rounded-full badge-green text-xs font-semibold'>
          <span className='material-symbols-outlined text-[14px] mr-1'>check_circle</span>
          Target: &gt;20%
        </div>
      </div>

      {/* KPI 3 */}
      <div className='bg-surface-container-lowest border border-gray rounded-lg p-stack-lg card-shadow'>
        <div className='font-label-md text-label-md text-on-secondary-container uppercase tracking-wider mb-2'>
          In-Stock Rate
        </div>
        <div className='font-stats-xl text-stats-xl dark-slate mb-3'>
          {in_stock_rate}%
        </div>
        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${in_stock_rate >= 95 ? 'badge-green' : 'badge-red'}`}>
          <span className='material-symbols-outlined text-[14px] mr-1'>
            {in_stock_rate >= 95 ? 'check_circle' : 'warning'}
          </span>
          Target: &gt;95%
        </div>
      </div>

      {/* KPI 4 */}
      <div className='bg-surface-container-lowest border border-gray rounded-lg p-stack-lg card-shadow'>
        <div className='font-label-md text-label-md text-on-secondary-container uppercase tracking-wider mb-2'>
          Shelf Capacity
        </div>
        <div className='font-stats-xl text-stats-xl dark-slate mb-3'>
          {shelf_capacity}%
        </div>
        <div className='inline-flex items-center px-2 py-1 rounded-full badge-gray text-xs font-semibold'>
          <span className='material-symbols-outlined text-[14px] mr-1'>info</span>
          Optimal: 80-90%
        </div>
      </div>
    </div>
  );
}
