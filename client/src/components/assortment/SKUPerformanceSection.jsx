import React from 'react';
import Badge from '../common/Badge';

export default function SKUPerformanceSection({ skus, total, page, limit, onPageChange, searchQuery }) {
  // Filter SKUs locally if searchQuery is provided
  const filteredSkus = skus.filter(sku =>
    sku.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-lg shadow-level-1 border border-outline-variant/30 overflow-hidden flex flex-col'>
      <div className='p-md border-b border-outline-variant/30 bg-surface flex justify-between items-center'>
        <h2 className='font-headline-sm text-headline-sm font-bold text-on-surface'>SKU Performance</h2>
        <div className='flex items-center gap-2 text-sm font-medium text-on-surface-variant'>
          <span className='material-symbols-outlined text-[18px]'>filter_list</span>
          <span>Total: {total}</span>
        </div>
      </div>
      <div className='overflow-x-auto flex-1'>
        <table className='w-full text-left border-collapse min-w-[600px]'>
          <thead>
            <tr className='bg-surface-container-low text-xs uppercase text-on-surface-variant border-b border-outline-variant tracking-wider font-semibold'>
              <th className='p-3 pl-4 sticky top-0 bg-surface-container-low'>SKU Name</th>
              <th className='p-3 sticky top-0 bg-surface-container-low text-right'>Sales</th>
              <th className='p-3 sticky top-0 bg-surface-container-low text-right'>Profit</th>
              <th className='p-3 sticky top-0 bg-surface-container-low text-right'>Volume</th>
              <th className='p-3 pr-4 sticky top-0 bg-surface-container-low text-center'>Status</th>
            </tr>
          </thead>
          <tbody className='text-sm text-on-surface divide-y divide-outline-variant/20 font-data-tabular'>
            {filteredSkus.length === 0 ? (
              <tr>
                <td colSpan='5' className='p-8 text-center text-on-surface-variant'>
                  No SKUs found matching your search.
                </td>
              </tr>
            ) : (
              filteredSkus.map((sku, idx) => (
                <tr key={sku.sku_id || idx} className='table-row-hover transition-colors group relative'>
                  <td className='absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-primary-container transition-colors'></td>
                  <td className='p-3 pl-4 font-medium'>{sku.name}</td>
                  <td className='p-3 text-right'>${sku.sales?.toLocaleString() || '0'}</td>
                  <td className='p-3 text-right'>${sku.profit?.toLocaleString() || '0'}</td>
                  <td className='p-3 text-right'>{sku.volume?.toLocaleString() || '0'}</td>
                  <td className='p-3 pr-4 text-center'>
                    <Badge status={sku.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {total > limit && (
        <div className='p-md border-t border-outline-variant/30 bg-surface flex justify-between items-center'>
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className='px-3 py-1 bg-surface-container-high rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container-highest transition-colors'
          >
            Previous
          </button>
          <span className='text-sm text-on-surface-variant'>
            Page {page} of {Math.ceil(total / limit)}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= Math.ceil(total / limit)}
            className='px-3 py-1 bg-surface-container-high rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container-highest transition-colors'
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
