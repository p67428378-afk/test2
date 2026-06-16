import React, { useState, useMemo } from 'react';
import Badge from '../common/Badge';

export default function SKUPerformanceTable({ skus, loading, error, searchQuery }) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortConfig, setSortConfig] = useState({ key: 'sales', direction: 'desc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedSKUs = useMemo(() => {
    if (!skus) return [];

    let result = [...skus];

    // Filter by status
    if (statusFilter !== 'ALL') {
      result = result.filter((sku) => sku.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (sku) =>
          sku.name.toLowerCase().includes(query) ||
          sku.brand.toLowerCase().includes(query) ||
          sku.sku.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [skus, statusFilter, searchQuery, sortConfig]);

  if (loading) {
    return (
      <div className='bg-[#1E293B] border border-[#334155] rounded-xl p-md animate-pulse h-96'>
        <div className='h-8 bg-[#334155] rounded mb-4 w-1/4'></div>
        <div className='space-y-3'>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className='h-12 bg-[#334155] rounded'></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-red-900/20 border border-red-800 text-red-400 p-md rounded-xl'>
        Failed to load SKU performance data.
      </div>
    );
  }

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <span className='material-symbols-outlined text-xs ml-1 opacity-30'>unfold_more</span>;
    }
    return sortConfig.direction === 'asc' ? (
      <span className='material-symbols-outlined text-xs ml-1 text-primary-container'>arrow_upward</span>
    ) : (
      <span className='material-symbols-outlined text-xs ml-1 text-primary-container'>arrow_downward</span>
    );
  };

  return (
    <div className='bg-[#1E293B] border border-[#334155] rounded-xl overflow-hidden flex flex-col' id='sku-performance'>
      <div className='p-md border-b border-[#334155] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-low'>
        <div>
          <h2 className='font-title-sm text-title-sm text-on-surface'>SKU Performance</h2>
          <p className='text-xs text-on-surface-variant mt-1'>
            Showing {filteredAndSortedSKUs.length} of {skus?.length || 0} Snacks SKUs
          </p>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-xs text-on-surface-variant font-semibold uppercase tracking-wider'>Filter Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className='bg-[#1E293B] border border-[#334155] text-on-surface rounded px-2 py-1 text-xs focus:outline-none focus:border-primary-container'
          >
            <option value='ALL'>All Statuses</option>
            <option value='GROW'>GROW</option>
            <option value='MAINTAIN'>MAINTAIN</option>
            <option value='SWAP'>SWAP</option>
            <option value='REDUCE'>REDUCE</option>
          </select>
        </div>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-left font-body-sm text-body-sm'>
          <thead className='bg-[#334155] font-label-caps text-label-caps text-on-surface-variant uppercase'>
            <tr>
              <th className='px-md py-sm font-semibold cursor-pointer select-none' onClick={() => handleSort('name')}>
                <div className='flex items-center'>SKU Name {renderSortIcon('name')}</div>
              </th>
              <th className='px-md py-sm font-semibold cursor-pointer select-none' onClick={() => handleSort('brand')}>
                <div className='flex items-center'>Brand Type {renderSortIcon('brand')}</div>
              </th>
              <th className='px-md py-sm font-semibold text-right cursor-pointer select-none' onClick={() => handleSort('sales')}>
                <div className='flex items-center justify-end'>Sales ($) {renderSortIcon('sales')}</div>
              </th>
              <th className='px-md py-sm font-semibold text-right cursor-pointer select-none' onClick={() => handleSort('profit_margin')}>
                <div className='flex items-center justify-end'>Margin {renderSortIcon('profit_margin')}</div>
              </th>
              <th className='px-md py-sm font-semibold text-right cursor-pointer select-none' onClick={() => handleSort('units_sold')}>
                <div className='flex items-center justify-end'>Units {renderSortIcon('units_sold')}</div>
              </th>
              <th className='px-md py-sm font-semibold text-right cursor-pointer select-none' onClick={() => handleSort('days_of_supply')}>
                <div className='flex items-center justify-end'>DOH {renderSortIcon('days_of_supply')}</div>
              </th>
              <th className='px-md py-sm font-semibold text-center cursor-pointer select-none' onClick={() => handleSort('status')}>
                <div className='flex items-center justify-center'>Action {renderSortIcon('status')}</div>
              </th>
            </tr>
          </thead>
          <tbody className='divide-y divide-[#334155]'>
            {filteredAndSortedSKUs.length === 0 ? (
              <tr>
                <td colSpan='7' className='px-md py-8 text-center text-on-surface-variant'>
                  No SKUs match the selected filters.
                </td>
              </tr>
            ) : (
              filteredAndSortedSKUs.map((sku) => (
                <tr key={sku.sku} className='hover:bg-[#334155]/50 transition-colors'>
                  <td className='px-md py-sm font-medium text-on-surface'>
                    <div>{sku.name}</div>
                    <div className='text-[10px] text-on-surface-variant font-mono'>{sku.sku}</div>
                  </td>
                  <td className='px-md py-sm text-on-surface-variant'>
                    {sku.brand} {sku.is_private_brand ? '(Private)' : '(National)'}
                  </td>
                  <td className='px-md py-sm text-right font-mono-data text-on-surface'>
                    ${sku.sales.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className='px-md py-sm text-right font-mono-data text-on-surface'>
                    {sku.profit_margin.toFixed(1)}%
                  </td>
                  <td className='px-md py-sm text-right font-mono-data text-on-surface'>
                    {sku.units_sold.toLocaleString()}
                  </td>
                  <td className='px-md py-sm text-right font-mono-data text-on-surface'>
                    {sku.days_of_supply}d
                  </td>
                  <td className='px-md py-sm text-center'>
                    <Badge status={sku.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
