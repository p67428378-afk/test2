import React from 'react';

export default function KPIHeaderStrip({ kpis, loading }) {
  if (loading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className='bg-[#1E293B] border border-[#334155] rounded-lg p-5 animate-pulse h-32'></div>
        ))}
      </div>
    );
  }

  const data = kpis || {
    sales_per_linear_ft: 125.50,
    sales_trend_pct: 4.2,
    private_brand_pct: 22.4,
    in_stock_rate: 94.1,
    shelf_capacity_pct: 88.0,
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
      {/* Card 1 */}
      <div className='bg-[#1E293B] border border-[#334155] rounded-lg p-5 flex flex-col'>
        <div className='flex justify-between items-start mb-2'>
          <span className='text-xs font-semibold text-[#d8c3ad] uppercase tracking-wider'>Sales/Linear Ft</span>
          <span className='material-symbols-outlined text-[#F59E0B] text-opacity-80' style={{ fontSize: '20px' }}>point_of_sale</span>
        </div>
        <div className='flex items-baseline gap-2 mt-auto'>
          <span className='text-3xl font-bold text-white font-mono'>${Number(data.sales_per_linear_ft).toFixed(2)}</span>
        </div>
        <div className={`mt-2 flex items-center gap-1 font-semibold text-xs ${data.sales_trend_pct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          <span className='material-symbols-outlined' style={{ fontSize: '16px' }}>
            {data.sales_trend_pct >= 0 ? 'trending_up' : 'trending_down'}
          </span>
          <span>{data.sales_trend_pct >= 0 ? '+' : ''}{data.sales_trend_pct}%</span>
        </div>
      </div>

      {/* Card 2 */}
      <div className='bg-[#1E293B] border border-[#334155] rounded-lg p-5 flex flex-col'>
        <div className='flex justify-between items-start mb-2'>
          <span className='text-xs font-semibold text-[#d8c3ad] uppercase tracking-wider'>Private Brand %</span>
          <span className='material-symbols-outlined text-[#F59E0B] text-opacity-80' style={{ fontSize: '20px' }}>inventory_2</span>
        </div>
        <div className='flex items-baseline gap-2 mt-auto'>
          <span className='text-3xl font-bold text-white font-mono'>{Number(data.private_brand_pct).toFixed(1)}%</span>
        </div>
        <div className='mt-2 text-xs text-[#d8c3ad]'>
          Target: 20-35%
        </div>
      </div>

      {/* Card 3 */}
      <div className='bg-[#1E293B] border border-[#F59E0B] bg-opacity-90 rounded-lg p-5 flex flex-col relative overflow-hidden'>
        <div className='absolute inset-0 bg-[#F59E0B]/5 z-0'></div>
        <div className='relative z-10'>
          <div className='flex justify-between items-start mb-2'>
            <span className='text-xs font-semibold text-[#d8c3ad] uppercase tracking-wider'>In-Stock Rate</span>
            <span className='material-symbols-outlined text-[#F59E0B]' style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>warning</span>
          </div>
          <div className='flex items-baseline gap-2 mt-auto'>
            <span className='text-3xl font-bold text-white font-mono'>{Number(data.in_stock_rate).toFixed(1)}%</span>
          </div>
          <div className='mt-2 text-xs text-[#F59E0B]'>
            Target: &gt;95%
          </div>
        </div>
      </div>

      {/* Card 4 */}
      <div className='bg-[#1E293B] border border-[#334155] rounded-lg p-5 flex flex-col'>
        <div className='flex justify-between items-start mb-2'>
          <span className='text-xs font-semibold text-[#d8c3ad] uppercase tracking-wider'>Shelf Capacity</span>
          <span className='material-symbols-outlined text-[#F59E0B] text-opacity-80' style={{ fontSize: '20px' }}>shelves</span>
        </div>
        <div className='flex items-baseline gap-2 mt-auto'>
          <span className='text-3xl font-bold text-white font-mono'>{Number(data.shelf_capacity_pct).toFixed(1)}%</span>
        </div>
        <div className='mt-2 text-xs text-[#d8c3ad]'>
          Target: &lt;90%
        </div>
      </div>
    </div>
  );
}
