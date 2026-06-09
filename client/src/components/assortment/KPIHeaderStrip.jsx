import React from 'react';

export default function KPIHeaderStrip({ kpis }) {
  const defaultKpis = {
    sales_per_linear_ft: { value: 425.50, change: 8.2, unit: '$', label: 'vs last period' },
    private_brand_pct: { value: 32.4, change: -2.6, unit: '%', label: 'Target: 35.0%' },
    in_stock_rate: { value: 98.2, change: 0.2, unit: '%', label: 'Target: 98.0%' },
    shelf_capacity: { value: 88.5, change: 3.5, unit: '%', label: 'Optimal: 85.0%' }
  };

  const data = kpis || defaultKpis;

  const formatValue = (key, item) => {
    if (key === 'sales_per_linear_ft') {
      return `$${item.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
    return `${item.value}${item.unit || '%'}`;
  };

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
      {/* KPI 1: Sales per Linear Ft */}
      <div className='dg-card rounded-xl p-[20px] flex flex-col gap-2 relative overflow-hidden group'>
        <div className='absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full -mr-8 -mt-8 group-hover:bg-primary/10 transition-colors'></div>
        <h3 className='text-body-sm font-body-sm text-on-surface-variant uppercase tracking-wider text-xs'>
          Sales per Linear Ft
        </h3>
        <div className='flex items-end gap-2'>
          <span className='text-headline-lg font-headline-lg text-on-surface font-data-mono text-2xl font-bold'>
            {formatValue('sales_per_linear_ft', data.sales_per_linear_ft || defaultKpis.sales_per_linear_ft)}
          </span>
        </div>
        <div className='flex items-center gap-1 mt-auto'>
          <span className='material-symbols-outlined text-[16px] text-green-400'>arrow_upward</span>
          <span className='text-body-sm font-body-sm font-bold text-green-400'>
            {Math.abs((data.sales_per_linear_ft || defaultKpis.sales_per_linear_ft).change)}%
          </span>
          <span className='text-label-caps font-label-caps text-on-surface-variant ml-1 text-xs'>
            {(data.sales_per_linear_ft || defaultKpis.sales_per_linear_ft).label || 'vs last period'}
          </span>
        </div>
      </div>

      {/* KPI 2: Private Brand % */}
      <div className='dg-card rounded-xl p-[20px] flex flex-col gap-2 relative overflow-hidden group'>
        <div className='absolute top-0 right-0 w-16 h-16 bg-error/5 rounded-bl-full -mr-8 -mt-8 group-hover:bg-error/10 transition-colors'></div>
        <h3 className='text-body-sm font-body-sm text-on-surface-variant uppercase tracking-wider text-xs'>
          Private Brand %
        </h3>
        <div className='flex items-end gap-2'>
          <span className='text-headline-lg font-headline-lg text-on-surface font-data-mono text-2xl font-bold'>
            {formatValue('private_brand_pct', data.private_brand_pct || defaultKpis.private_brand_pct)}
          </span>
        </div>
        <div className='flex items-center gap-1 mt-auto'>
          <span className={`material-symbols-outlined text-[16px] ${(data.private_brand_pct || defaultKpis.private_brand_pct).change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {(data.private_brand_pct || defaultKpis.private_brand_pct).change >= 0 ? 'arrow_upward' : 'arrow_downward'}
          </span>
          <span className={`text-body-sm font-body-sm font-bold ${(data.private_brand_pct || defaultKpis.private_brand_pct).change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {Math.abs((data.private_brand_pct || defaultKpis.private_brand_pct).change)}%
          </span>
          <span className='text-label-caps font-label-caps text-on-surface-variant ml-1 text-xs'>
            {(data.private_brand_pct || defaultKpis.private_brand_pct).label || 'Target: 35.0%'}
          </span>
        </div>
      </div>

      {/* KPI 3: In-Stock Rate */}
      <div className='dg-card rounded-xl p-[20px] flex flex-col gap-2 relative overflow-hidden group'>
        <div className='absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-bl-full -mr-8 -mt-8 group-hover:bg-primary/10 transition-colors'></div>
        <h3 className='text-body-sm font-body-sm text-on-surface-variant uppercase tracking-wider text-xs'>
          In-Stock Rate
        </h3>
        <div className='flex items-end gap-2'>
          <span className='text-headline-lg font-headline-lg text-on-surface font-data-mono text-2xl font-bold'>
            {formatValue('in_stock_rate', data.in_stock_rate || defaultKpis.in_stock_rate)}
          </span>
        </div>
        <div className='flex items-center gap-1 mt-auto'>
          <span className={`material-symbols-outlined text-[16px] ${(data.in_stock_rate || defaultKpis.in_stock_rate).change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {(data.in_stock_rate || defaultKpis.in_stock_rate).change >= 0 ? 'arrow_upward' : 'arrow_downward'}
          </span>
          <span className={`text-body-sm font-body-sm font-bold ${(data.in_stock_rate || defaultKpis.in_stock_rate).change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {Math.abs((data.in_stock_rate || defaultKpis.in_stock_rate).change)}%
          </span>
          <span className='text-label-caps font-label-caps text-on-surface-variant ml-1 text-xs'>
            {(data.in_stock_rate || defaultKpis.in_stock_rate).label || 'Target: 98.0%'}
          </span>
        </div>
      </div>

      {/* KPI 4: Shelf Capacity */}
      <div className='dg-card rounded-xl p-[20px] flex flex-col gap-2 relative overflow-hidden group'>
        <div className='absolute top-0 right-0 w-16 h-16 bg-amber-400/5 rounded-bl-full -mr-8 -mt-8 group-hover:bg-amber-400/10 transition-colors'></div>
        <h3 className='text-body-sm font-body-sm text-on-surface-variant uppercase tracking-wider text-xs'>
          Shelf Capacity
        </h3>
        <div className='flex items-end gap-2'>
          <span className='text-headline-lg font-headline-lg text-on-surface font-data-mono text-2xl font-bold'>
            {formatValue('shelf_capacity', data.shelf_capacity || defaultKpis.shelf_capacity)}
          </span>
        </div>
        <div className='flex items-center gap-1 mt-auto'>
          <span className={`material-symbols-outlined text-[16px] ${(data.shelf_capacity || defaultKpis.shelf_capacity).change >= 0 ? 'text-amber-400' : 'text-green-400'}`}>
            {(data.shelf_capacity || defaultKpis.shelf_capacity).change >= 0 ? 'arrow_upward' : 'arrow_downward'}
          </span>
          <span className={`text-body-sm font-body-sm font-bold ${(data.shelf_capacity || defaultKpis.shelf_capacity).change >= 0 ? 'text-amber-400' : 'text-green-400'}`}>
            {Math.abs((data.shelf_capacity || defaultKpis.shelf_capacity).change)}%
          </span>
          <span className='text-label-caps font-label-caps text-on-surface-variant ml-1 text-xs'>
            {(data.shelf_capacity || defaultKpis.shelf_capacity).label || 'Optimal: 85.0%'}
          </span>
        </div>
      </div>
    </div>
  );
}