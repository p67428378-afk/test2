import React from 'react';

export default function KpiHeaderStrip({ kpis, loading }) {
  if (loading || !kpis) {
    return (
      <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className='bg-white border border-[#d1c6ab]/50 rounded-xl p-5 animate-pulse h-32'>
            <div className='h-4 bg-gray-200 rounded w-1/2 mb-4'></div>
            <div className='h-8 bg-gray-200 rounded w-3/4'></div>
          </div>
        ))}
      </section>
    );
  }

  const { sales_per_linear_ft, private_brand_percentage, in_stock_rate, shelf_capacity } = kpis;

  // Calculate progress bar width for Private Brand % (Target: 20.0%)
  const pbProgress = Math.min((private_brand_percentage / 20.0) * 100, 100);

  return (
    <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
      {/* KPI 1: Sales per Linear Ft */}
      <div className='bg-white border border-[#d1c6ab]/50 rounded-xl p-5 flex flex-col justify-between shadow-sm'>
        <div className='flex justify-between items-start mb-2'>
          <span className='text-xs font-semibold text-[#4d4632] uppercase tracking-wider'>Sales per Linear Ft</span>
          <div className='flex items-center gap-1 text-[12px] font-semibold text-[#10B981] bg-[#10B981]/10 px-2 py-0.5 rounded-full'>
            <span className='material-symbols-outlined text-[14px]'>arrow_upward</span>
            5.2%
          </div>
        </div>
        <div className='text-3xl font-bold text-[#0b1c30]'>
          ${sales_per_linear_ft?.toFixed(2)}
        </div>
      </div>

      {/* KPI 2: Private Brand % */}
      <div className='bg-white border border-[#d1c6ab]/50 rounded-xl p-5 flex flex-col justify-between shadow-sm'>
        <div className='flex justify-between items-start mb-2'>
          <span className='text-xs font-semibold text-[#4d4632] uppercase tracking-wider'>Private Brand %</span>
          <span className='text-[12px] text-[#4d4632]/70 font-medium'>Target: 20.0%</span>
        </div>
        <div>
          <div className='text-3xl font-bold text-[#0b1c30] mb-2'>
            {private_brand_percentage?.toFixed(1)}%
          </div>
          {/* Progress Bar */}
          <div className='w-full h-2 bg-[#d3e4fe] rounded-full overflow-hidden'>
            <div className='h-full bg-[#ffd200] rounded-full' style={{ width: `${pbProgress}%` }}></div>
          </div>
        </div>
      </div>

      {/* KPI 3: In-Stock Rate */}
      <div className='bg-white border border-[#d1c6ab]/50 rounded-xl p-5 flex flex-col justify-between shadow-sm'>
        <div className='flex justify-between items-start mb-2'>
          <span className='text-xs font-semibold text-[#4d4632] uppercase tracking-wider flex items-center gap-1'>
            In-Stock Rate
            {in_stock_rate < 98.0 && (
              <span className='material-symbols-outlined text-[#ba1a1a] text-[16px]' title='Below Target'>warning</span>
            )}
          </span>
          <span className='text-[12px] text-[#4d4632]/70 font-medium'>Target: 98.0%</span>
        </div>
        <div className={`text-3xl font-bold ${in_stock_rate < 98.0 ? 'text-[#ba1a1a]' : 'text-[#10B981]'}`}>
          {in_stock_rate?.toFixed(1)}%
        </div>
      </div>

      {/* KPI 4: Shelf Capacity */}
      <div className='bg-white border border-[#d1c6ab]/50 rounded-xl p-5 flex flex-col justify-between shadow-sm'>
        <div className='flex justify-between items-start mb-2'>
          <span className='text-xs font-semibold text-[#4d4632] uppercase tracking-wider'>Shelf Capacity</span>
        </div>
        <div>
          <div className='text-3xl font-bold text-[#0b1c30] mb-1'>
            {shelf_capacity?.toFixed(1)}%
          </div>
          <p className='text-xs text-[#4d4632]/70'>
            {Math.round(shelf_capacity * 10)} / 1000 inches used
          </p>
        </div>
      </div>
    </section>
  );
}
