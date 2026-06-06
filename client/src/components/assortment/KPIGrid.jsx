import React from 'react';

export default function KPIGrid({ kpis }) {
  // Fallback values matching Stitch HTML exactly
  const data = kpis || {
    sales_per_linear_ft: 1245.50,
    sales_per_linear_ft_change: 8.2,
    private_brand_percentage: 24.5,
    private_brand_target: 30.0,
    in_stock_rate: 96.8,
    in_stock_target: 95.0,
    shelf_capacity_percentage: 88,
    shelf_capacity_used: 88,
    shelf_capacity_total: 100
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6'>
      {/* KPI 1: Sales per Linear Foot */}
      <div className='bg-[#1E293B] rounded-lg p-5 border border-[#334155] hover:bg-[#26334a] transition-colors'>
        <h3 className='text-xs font-medium text-[#d1c6ab] uppercase tracking-wider mb-2'>Sales per Linear Foot</h3>
        <div className='text-3xl font-semibold text-[#dae2fd] mb-2'>
          {formatCurrency(data.sales_per_linear_ft)}
        </div>
        <div className='flex items-center gap-1 text-[#10B981]'>
          <span className='material-symbols-outlined text-[16px]'>trending_up</span>
          <span className='text-sm'>+{data.sales_per_linear_ft_change}% vs last month</span>
        </div>
      </div>

      {/* KPI 2: Private Brand % */}
      <div className='bg-[#1E293B] rounded-lg p-5 border border-[#334155] hover:bg-[#26334a] transition-colors'>
        <h3 className='text-xs font-medium text-[#d1c6ab] uppercase tracking-wider mb-2'>Private Brand %</h3>
        <div className='text-3xl font-semibold text-[#dae2fd] mb-2'>
          {data.private_brand_percentage}%
        </div>
        <div className='flex items-center gap-1 text-[#F59E0B]'>
          <span className='material-symbols-outlined text-[16px]'>warning</span>
          <span className='text-sm'>Target: {data.private_brand_target}%</span>
        </div>
      </div>

      {/* KPI 3: In-Stock Rate */}
      <div className='bg-[#1E293B] rounded-lg p-5 border border-[#334155] hover:bg-[#26334a] transition-colors'>
        <h3 className='text-xs font-medium text-[#d1c6ab] uppercase tracking-wider mb-2'>In-Stock Rate</h3>
        <div className='text-3xl font-semibold text-[#dae2fd] mb-2'>
          {data.in_stock_rate}%
        </div>
        <div className='flex items-center gap-1 text-[#10B981]'>
          <span className='material-symbols-outlined text-[16px]'>check_circle</span>
          <span className='text-sm'>Target: {data.in_stock_target}%</span>
        </div>
      </div>

      {/* KPI 4: Shelf Capacity */}
      <div className='bg-[#1E293B] rounded-lg p-5 border border-[#334155] hover:bg-[#26334a] transition-colors'>
        <h3 className='text-xs font-medium text-[#d1c6ab] uppercase tracking-wider mb-2'>Shelf Capacity</h3>
        <div className='text-3xl font-semibold text-[#dae2fd] mb-2'>
          {data.shelf_capacity_percentage}%
        </div>
        <div className='w-full bg-[#060e20] rounded-full h-1.5 mb-1'>
          <div 
            className='bg-[#3B82F6] h-1.5 rounded-full' 
            style={{ width: `${data.shelf_capacity_percentage}%` }}
          ></div>
        </div>
        <div className='text-xs text-[#d1c6ab] text-right'>
          {data.shelf_capacity_used}/{data.shelf_capacity_total} linear feet
        </div>
      </div>
    </div>
  );
}
