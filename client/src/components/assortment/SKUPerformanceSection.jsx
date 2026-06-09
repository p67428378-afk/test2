import React, { useState } from 'react';

export default function SKUPerformanceSection({ skus }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [brandFilter, setBrandFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Filter logic
  const filteredSkus = skus.filter(sku => {
    const matchesSearch = sku.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          sku.sku_number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = brandFilter === 'All' || 
                         (brandFilter === 'Private Brand' && sku.private_brand) ||
                         (brandFilter === 'National Brand' && !sku.private_brand);
    const matchesStatus = statusFilter === 'All' || sku.status_badge === statusFilter;
    return matchesSearch && matchesBrand && matchesStatus;
  });

  const getBadgeClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'GROW':
        return 'bg-green-100 text-green-700';
      case 'MAINTAIN':
        return 'bg-yellow-100 text-yellow-700';
      case 'SWAP':
        return 'bg-orange-100 text-orange-700';
      case 'REDUCE':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <section className='bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden'>
      <div className='p-stack-md border-b border-outline-variant flex flex-col md:flex-row md:items-center justify-between gap-stack-sm'>
        <h2 className='font-headline-sm text-headline-sm'>Snacks SKU Performance</h2>
        <div className='flex flex-wrap gap-2'>
          <div className='relative'>
            <span className='material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-secondary text-[18px]'>search</span>
            <input
              className='pl-9 pr-4 py-1.5 bg-surface rounded-lg border border-outline-variant text-body-sm w-48 focus:ring-1 focus:ring-primary'
              placeholder='Search SKUs...'
              type='text'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            className='px-3 py-1.5 bg-surface border border-outline-variant rounded-lg text-label-md focus:ring-1 focus:ring-primary'
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
          >
            <option value='All'>All Brands</option>
            <option value='Private Brand'>Private Brand</option>
            <option value='National Brand'>National Brand</option>
          </select>
          <select
            className='px-3 py-1.5 bg-surface border border-outline-variant rounded-lg text-label-md focus:ring-1 focus:ring-primary'
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value='All'>All Statuses</option>
            <option value='GROW'>Grow</option>
            <option value='MAINTAIN'>Maintain</option>
            <option value='SWAP'>Swap</option>
            <option value='REDUCE'>Reduce</option>
          </select>
        </div>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-left border-collapse'>
          <thead className='bg-surface text-secondary uppercase text-[10px] font-bold tracking-widest border-b border-outline-variant'>
            <tr>
              <th className='px-4 py-3'>SKU Name</th>
              <th className='px-4 py-3'>SKU Number</th>
              <th className='px-4 py-3'>Private Brand</th>
              <th className='px-4 py-3 text-right'>Sales/Week</th>
              <th className='px-4 py-3 text-right'>In-Stock</th>
              <th className='px-4 py-3 text-center'>Status</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-outline-variant'>
            {filteredSkus.length === 0 ? (
              <tr>
                <td colSpan='6' className='px-4 py-8 text-center text-secondary text-body-md'>
                  No SKUs match the selected filters.
                </td>
              </tr>
            ) : (
              filteredSkus.map((sku) => (
                <tr key={sku.sku_id} className='hover:bg-surface-container-low transition-colors group'>
                  <td className='px-4 py-4 font-body-md font-semibold text-on-surface'>{sku.name}</td>
                  <td className='px-4 py-4 text-body-sm text-secondary font-mono'>{sku.sku_number}</td>
                  <td className='px-4 py-4 text-body-sm text-secondary'>
                    {sku.private_brand ? (
                      <span className='font-medium text-primary'>Yes (Clover Valley)</span>
                    ) : (
                      'No'
                    )}
                  </td>
                  <td className='px-4 py-4 text-body-sm font-mono text-on-surface text-right'>
                    ${sku.sales_per_week?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className='px-4 py-4 text-body-sm font-mono text-on-surface text-right'>
                    {sku.in_stock_rate?.toFixed(1)}%
                  </td>
                  <td className='px-4 py-4 text-center'>
                    <span className={`px-2 py-1 font-label-sm rounded uppercase ${getBadgeClass(sku.status_badge)}`}>
                      {sku.status_badge}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className='p-4 border-t border-outline-variant flex justify-between items-center bg-surface'>
        <span className='text-body-sm text-secondary'>
          Showing {filteredSkus.length} of {skus.length} SKUs
        </span>
      </div>
    </section>
  );
}
