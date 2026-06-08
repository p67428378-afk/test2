import React, { useState } from 'react';

export default function SKUPerformanceTable({ skus }) {
  const [filterText, setFilterText] = useState('');
  const [showPrivateBrandOnly, setShowPrivateBrandOnly] = useState(false);

  const filteredSkus = (skus || []).filter(sku => {
    const matchesSearch = sku.name?.toLowerCase().includes(filterText.toLowerCase()) ||
                          sku.sku_number?.toLowerCase().includes(filterText.toLowerCase());
    const matchesBrand = !showPrivateBrandOnly || sku.brand === 'Private Brand';
    return matchesSearch && matchesBrand;
  });

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'GROW':
        return (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-[#DCFCE7] text-[#166534]'>
            <span className='material-symbols-outlined text-[14px] mr-1'>arrow_upward</span> GROW
          </span>
        );
      case 'MAINTAIN':
        return (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-[#DBEAFE] text-[#1E40AF]'>
            <span className='material-symbols-outlined text-[14px] mr-1'>drag_handle</span> MAINTAIN
          </span>
        );
      case 'SWAP':
        return (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-[#FEF3C7] text-[#92400E]'>
            <span className='material-symbols-outlined text-[14px] mr-1'>swap_horiz</span> SWAP
          </span>
        );
      case 'REDUCE':
        return (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-[#FEE2E2] text-[#991B1B]'>
            <span className='material-symbols-outlined text-[14px] mr-1'>arrow_downward</span> REDUCE
          </span>
        );
      default:
        return (
          <span className='inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-surface-variant text-on-surface-variant'>
            {status}
          </span>
        );
    }
  };

  return (
    <section aria-label='SKU Performance' className='bg-surface-container-lowest border border-surface-variant rounded-lg shadow-sm overflow-hidden flex flex-col'>
      <div className='p-md border-b border-surface-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-bright'>
        <h2 className='font-headline-sm text-headline-sm text-on-surface'>SKU Performance</h2>
        <div className='flex flex-wrap gap-2 w-full sm:w-auto'>
          <input
            type='text'
            placeholder='Search SKU or Name...'
            className='border border-outline-variant rounded px-3 py-1 text-sm focus:outline-none focus:border-primary'
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
          <button
            onClick={() => setShowPrivateBrandOnly(!showPrivateBrandOnly)}
            className={`px-3 py-1.5 rounded font-label-md text-label-md border transition-colors flex items-center gap-1 ${showPrivateBrandOnly ? 'bg-primary-container border-primary text-on-primary-container' : 'bg-surface-container border-outline-variant text-on-surface hover:bg-surface-variant'}`}
          >
            <span className='material-symbols-outlined text-[18px]'>filter_list</span>
            {showPrivateBrandOnly ? 'Showing Private Brand' : 'All Brands'}
          </button>
        </div>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-left border-collapse'>
          <thead className='bg-surface-container-low font-label-md text-label-md text-on-surface-variant border-b border-surface-variant'>
            <tr>
              <th className='py-3 px-4 font-semibold'>SKU ID &amp; Product Name</th>
              <th className='py-3 px-4 font-semibold text-right'>Current Sales ($)</th>
              <th className='py-3 px-4 font-semibold text-right'>Sales / Lin Ft ($)</th>
              <th className='py-3 px-4 font-semibold text-right'>In-Stock Rate (%)</th>
              <th className='py-3 px-4 font-semibold text-center'>Recommendation</th>
            </tr>
          </thead>
          <tbody className='font-data-tabular text-data-tabular text-on-surface divide-y divide-surface-variant'>
            {filteredSkus.length === 0 ? (
              <tr>
                <td colSpan='5' className='py-8 text-center text-on-surface-variant'>
                  No SKUs found matching the criteria.
                </td>
              </tr>
            ) : (
              filteredSkus.map((sku) => (
                <tr key={sku.id || sku.sku_number} className='hover:bg-surface-container-lowest transition-colors group cursor-pointer'>
                  <td className='py-3 px-4'>
                    <div className='font-medium text-on-surface'>{sku.sku_number}</div>
                    <div className='text-on-surface-variant font-body-md text-body-md mt-0.5'>{sku.name}</div>
                    {sku.brand === 'Private Brand' && (
                      <span className='inline-block mt-1 text-[10px] bg-primary-fixed text-on-primary-fixed px-1.5 py-0.5 rounded font-semibold uppercase'>
                        Private Brand
                      </span>
                    )}
                  </td>
                  <td className='py-3 px-4 text-right'>${(sku.current_sales || 0).toLocaleString()}</td>
                  <td className='py-3 px-4 text-right'>${(sku.sales_per_linear_ft || 0).toFixed(2)}</td>
                  <td className='py-3 px-4 text-right'>{(sku.in_stock_rate || 0).toFixed(1)}%</td>
                  <td className='py-3 px-4 text-center'>
                    {getStatusBadge(sku.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className='p-3 border-t border-surface-variant bg-surface-bright flex justify-center'>
        <div className='text-on-surface-variant font-label-md text-label-md'>
          Showing {filteredSkus.length} of {(skus || []).length} SKUs
        </div>
      </div>
    </section>
  );
}