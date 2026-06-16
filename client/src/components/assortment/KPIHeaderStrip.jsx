import React from 'react';

export default function KPIHeaderStrip({ kpis, loading, error }) {
  if (loading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-gutter animate-pulse'>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className='bg-[#1E293B] border border-[#334155] rounded-xl p-md h-24'></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-red-900/20 border border-red-800 text-red-400 p-md rounded-xl mb-gutter'>
        Failed to load KPI metrics. Please try again later.
      </div>
    );
  }

  const metrics = [
    {
      label: 'Sales per Linear Ft',
      value: kpis?.sales_per_linear_ft ? `$${kpis.sales_per_linear_ft.value.toFixed(2)}` : '$0.00',
      change: kpis?.sales_per_linear_ft?.change_percentage ?? 0,
      trend: kpis?.sales_per_linear_ft?.trend ?? 'stable',
    },
    {
      label: 'Private Brand %',
      value: kpis?.private_brand_percentage ? `${kpis.private_brand_percentage.value.toFixed(1)}%` : '0.0%',
      change: kpis?.private_brand_percentage?.change_percentage ?? 0,
      trend: kpis?.private_brand_percentage?.trend ?? 'stable',
    },
    {
      label: 'In-Stock Rate',
      value: kpis?.in_stock_rate ? `${kpis.in_stock_rate.value.toFixed(1)}%` : '0.0%',
      change: kpis?.in_stock_rate?.change_percentage ?? 0,
      trend: kpis?.in_stock_rate?.trend ?? 'stable',
    },
    {
      label: 'Shelf Capacity',
      value: kpis?.shelf_capacity ? `${kpis.shelf_capacity.value.toFixed(1)}%` : '0.0%',
      change: kpis?.shelf_capacity?.change_percentage ?? 0,
      trend: kpis?.shelf_capacity?.trend ?? 'stable',
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-gutter'>
      {metrics.map((metric, index) => {
        const isUp = metric.trend === 'up';
        const isDown = metric.trend === 'down';
        const isStable = metric.trend === 'stable';
        
        let trendColor = 'text-gray-400 bg-gray-400/10';
        let trendIcon = 'trending_flat';
        
        if (isUp) {
          trendColor = 'text-green-400 bg-green-400/10';
          trendIcon = 'arrow_upward';
        } else if (isDown) {
          trendColor = 'text-red-400 bg-red-400/10';
          trendIcon = 'arrow_downward';
        }

        return (
          <div
            key={index}
            className='bg-[#1E293B] border border-[#334155] rounded-xl p-md flex flex-col hover:border-surface-container-highest transition-colors'
          >
            <span className='font-label-caps text-label-caps text-on-surface-variant uppercase mb-xs'>
              {metric.label}
            </span>
            <div className='flex items-end justify-between mt-auto'>
              <span className='font-display-lg text-display-lg text-on-surface'>
                {metric.value}
              </span>
              {!isStable && (
                <span className={`font-mono-data text-mono-data flex items-center bg-opacity-10 px-2 py-0.5 rounded text-xs ${trendColor}`}>
                  <span className='material-symbols-outlined text-[14px] mr-0.5'>{trendIcon}</span>
                  {Math.abs(metric.change).toFixed(1)}%
                </span>
              )}
              {isStable && (
                <span className={`font-mono-data text-mono-data flex items-center bg-opacity-10 px-2 py-0.5 rounded text-xs ${trendColor}`}>
                  <span className='material-symbols-outlined text-[14px] mr-0.5'>trending_flat</span>
                  Stable
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
