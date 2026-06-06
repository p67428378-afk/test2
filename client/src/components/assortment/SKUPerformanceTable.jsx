import React from 'react';

export default function SKUPerformanceTable({ skus, onOptimize }) {
  // Fallback values matching Stitch HTML exactly
  const data = skus || [
    {
      sku_id: 'SKU-40129',
      product_name: 'Clover Valley Potato Chips 10oz',
      brand: 'Clover Valley [Private Brand]',
      weekly_sales: 1450.00,
      linear_ft: 2.0,
      sales_per_linear_ft: 725.00,
      status: 'GROW'
    },
    {
      sku_id: 'SKU-40130',
      product_name: "Lay's Classic 13oz",
      brand: "Lay's",
      weekly_sales: 2100.00,
      linear_ft: 3.5,
      sales_per_linear_ft: 600.00,
      status: 'MAINTAIN'
    },
    {
      sku_id: 'SKU-40131',
      product_name: 'Clover Valley Pretzels 16oz',
      brand: 'Clover Valley [Private Brand]',
      weekly_sales: 320.00,
      linear_ft: 1.5,
      sales_per_linear_ft: 213.33,
      status: 'SWAP'
    },
    {
      sku_id: 'SKU-40132',
      product_name: 'Doritos Nacho Cheese 9.75oz',
      brand: 'Doritos',
      weekly_sales: 1850.00,
      linear_ft: 2.5,
      sales_per_linear_ft: 740.00,
      status: 'MAINTAIN'
    },
    {
      sku_id: 'SKU-40133',
      product_name: 'Clover Valley Tortilla Chips 12oz',
      brand: 'Clover Valley [Private Brand]',
      weekly_sales: 150.00,
      linear_ft: 1.0,
      sales_per_linear_ft: 150.00,
      status: 'REDUCE'
    }
  ];

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'GROW':
        return 'bg-emerald-20 text-emerald';
      case 'MAINTAIN':
        return 'bg-blue-20 text-blue';
      case 'SWAP':
        return 'bg-amber-20 text-amber';
      case 'REDUCE':
        return 'bg-red-20 text-red';
      default:
        return 'bg-slate-700/50 text-slate-300';
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);
  };

  return (
    <div className='bg-[#1E293B] rounded-lg border border-[#334155] overflow-hidden flex flex-col'>
      <div className='p-5 border-b border-[#334155] flex justify-between items-center bg-[#1E293B]'>
        <h2 className='text-lg font-medium text-[#dae2fd]'>SKU Performance &amp; Recommendations</h2>
        <div className='flex gap-2'>
          <button className='p-2 rounded border border-[#334155] text-[#d1c6ab] hover:text-[#ffd200] hover:border-[#ffd200] transition-colors'>
            <span className='material-symbols-outlined text-[18px]'>filter_list</span>
          </button>
          <button className='p-2 rounded border border-[#334155] text-[#d1c6ab] hover:text-[#ffd200] hover:border-[#ffd200] transition-colors'>
            <span className='material-symbols-outlined text-[18px]'>download</span>
          </button>
        </div>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-left border-collapse whitespace-nowrap'>
          <thead>
            <tr class='bg-[#060e20]/50 text-xs font-medium text-[#d1c6ab] uppercase tracking-wider border-b border-[#334155]'>
              <th className='py-3 px-4 font-medium'>SKU ID</th>
              <th className='py-3 px-4 font-medium'>Product Name</th>
              <th className='py-3 px-4 font-medium'>Brand</th>
              <th className='py-3 px-4 font-medium text-right'>Weekly Sales</th>
              <th className='py-3 px-4 font-medium text-right'>Linear Ft</th>
              <th className='py-3 px-4 font-medium text-right'>Sales/Linear Ft</th>
              <th className='py-3 px-4 font-medium text-center'>Status</th>
              <th className='py-3 px-4 font-medium text-right'>Actions</th>
            </tr>
          </thead>
          <tbody className='text-sm divide-y divide-[#334155]'>
            {data.map((sku) => (
              <tr key={sku.sku_id} className='hover:bg-[#31394d]/30 transition-colors h-[48px]'>
                <td className='py-2 px-4 text-[#d1c6ab] font-mono'>{sku.sku_id}</td>
                <td className='py-2 px-4 text-[#dae2fd] font-medium truncate max-w-[200px]'>{sku.product_name}</td>
                <td className='py-2 px-4 text-[#d1c6ab]'>{sku.brand}</td>
                <td className='py-2 px-4 text-[#dae2fd] text-right'>{formatCurrency(sku.weekly_sales)}</td>
                <td className='py-2 px-4 text-[#dae2fd] text-right'>{sku.linear_ft.toFixed(1)}</td>
                <td className='py-2 px-4 text-[#dae2fd] text-right'>{formatCurrency(sku.sales_per_linear_ft)}</td>
                <td className='py-2 px-4 text-center'>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(sku.status)}`}>
                    {sku.status}
                  </span>
                </td>
                <td className='py-2 px-4 text-right'>
                  <button 
                    onClick={() => onOptimize && onOptimize(sku)}
                    className='text-xs font-medium px-3 py-1 border border-[#334155] rounded text-[#dae2fd] hover:border-[#ffd200] hover:text-[#ffd200] hover:shadow-[0_0_4px_rgba(255,210,0,0.3)] transition-all'
                  >
                    Optimize
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className='p-4 border-t border-[#334155] bg-[#1E293B] flex justify-between items-center text-sm text-[#d1c6ab]'>
        <div>Showing 1-{data.length} of 48 SKUs</div>
        <div className='flex gap-2'>
          <button className='px-3 py-1 border border-[#334155] rounded hover:bg-[#31394d] transition-colors disabled:opacity-50' disabled={true}>Prev</button>
          <button className='px-3 py-1 border border-[#334155] rounded hover:bg-[#31394d] transition-colors'>Next</button>
        </div>
      </div>
    </div>
  );
}
