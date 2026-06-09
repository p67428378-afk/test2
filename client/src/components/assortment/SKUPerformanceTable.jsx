import React, { useState } from 'react';

export default function SKUPerformanceTable({ skus }) {
  const [searchTerm, setSearchTerm] = useState('');

  const defaultSkus = [
    { sku_id: 'SKU-1001', name: 'Clover Valley Potato Chips 10oz', sales: 12450, profit_margin: 42.5, units_sold: 4500, status_badge: 'GROW' },
    { sku_id: 'SKU-1002', name: 'Clover Valley Tortilla Chips 12oz', sales: 9820, profit_margin: 38.0, units_sold: 3200, status_badge: 'GROW' },
    { sku_id: 'SKU-1003', name: 'Brand A Cheese Puffs 8oz', sales: 8150, profit_margin: 28.5, units_sold: 2100, status_badge: 'MAINTAIN' },
    { sku_id: 'SKU-1004', name: 'Brand B Pretzels 16oz', sales: 4200, profit_margin: 22.0, units_sold: 1100, status_badge: 'SWAP' },
    { sku_id: 'SKU-1005', name: 'Clover Valley Cheese Crackers 6oz', sales: 7800, profit_margin: 45.0, units_sold: 2800, status_badge: 'MAINTAIN' },
    { sku_id: 'SKU-1006', name: 'Brand C Popcorn 5oz', sales: 1850, profit_margin: 15.0, units_sold: 600, status_badge: 'REDUCE' },
    { sku_id: 'SKU-1007', name: 'Brand D Mixed Nuts 10oz', sales: 6400, profit_margin: 30.0, units_sold: 1400, status_badge: 'MAINTAIN' },
    { sku_id: 'SKU-1008', name: 'Brand E Peanuts 16oz', sales: 3100, profit_margin: 18.0, units_sold: 800, status_badge: 'SWAP' }
  ];

  const list = skus || defaultSkus;

  const filteredSkus = list.filter(sku =>
    sku.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sku.sku_id || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBadgeClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'GROW':
        return 'status-grow';
      case 'MAINTAIN':
        return 'status-maintain';
      case 'SWAP':
        return 'status-swap';
      case 'REDUCE':
        return 'status-reduce';
      default:
        return 'status-maintain';
    }
  };

  return (
    <div className='lg:col-span-8 dg-card rounded-xl flex flex-col overflow-hidden'>
      <div className='p-4 border-b border-[#334155] flex justify-between items-center bg-[#1E293B] shrink-0'>
        <h2 className='text-headline-md font-headline-md text-on-surface flex items-center gap-2 text-lg font-bold'>
          <span className='material-symbols-outlined text-primary'>inventory_2</span>
          Snacks SKU Performance
        </h2>
        <div className='relative'>
          <span className='material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]'>
            search
          </span>
          <input
            type='text'
            className='bg-[#0F172A] border border-[#334155] text-on-surface font-body-sm rounded-full pl-8 pr-4 py-1 w-48 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-on-surface-variant/50 focus:w-64 text-sm'
            placeholder='Search SKUs...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className='flex-1 overflow-auto max-h-[500px]'>
        <table className='w-full text-left border-collapse min-w-[800px]'>
          <thead className='sticky top-0 z-10 dg-table-header shadow-sm border-b border-[#334155]'>
            <tr>
              <th className='p-3 text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider w-24 text-xs font-bold'>
                SKU ID
              </th>
              <th className='p-3 text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider text-xs font-bold'>
                SKU Name
              </th>
              <th className='p-3 text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider text-right w-24 text-xs font-bold'>
                Sales
              </th>
              <th className='p-3 text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider text-right w-24 text-xs font-bold'>
                Margin
              </th>
              <th className='p-3 text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider text-right w-24 text-xs font-bold'>
                Units
              </th>
              <th className='p-3 text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider text-center w-32 text-xs font-bold'>
                Action
              </th>
            </tr>
          </thead>
          <tbody className='text-body-sm font-body-sm font-data-mono text-sm'>
            {filteredSkus.map((sku) => (
              <tr key={sku.sku_id} className='dg-table-row border-b border-[#334155]/30 cursor-pointer group'>
                <td className='p-3 text-on-surface-variant'>{sku.sku_id}</td>
                <td className='p-3 font-body-sm text-on-surface group-hover:text-primary transition-colors'>
                  {sku.name}
                </td>
                <td className='p-3 text-right'>
                  ${sku.sales.toLocaleString()}
                </td>
                <td className={`p-3 text-right ${sku.profit_margin >= 30 ? 'text-green-400' : sku.profit_margin < 20 ? 'text-red-400' : 'text-on-surface-variant'}`}>
                  {sku.profit_margin}%
                </td>
                <td className='p-3 text-right'>
                  {sku.units_sold.toLocaleString()}
                </td>
                <td className='p-3 text-center'>
                  <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold tracking-wider w-full ${getBadgeClass(sku.status_badge)}`}>
                    {sku.status_badge}
                  </span>
                </td>
              </tr>
            ))}
            {filteredSkus.length === 0 && (
              <tr>
                <td colSpan='6' className='p-4 text-center text-on-surface-variant'>
                  No SKUs found matching "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}