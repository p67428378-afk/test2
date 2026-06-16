import React, { useState, useMemo } from 'react';
import Badge from '../common/Badge';

export default function SKUPerformanceSection({ skuActions }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'sku_name', direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedSKUs = useMemo(() => {
    if (!skuActions) return [];

    // Filter
    let result = skuActions.filter((sku) =>
      sku.sku_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
  }, [skuActions, searchTerm, sortConfig]);

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <span className='material-symbols-outlined text-[14px] ml-1 text-secondary opacity-50'>unfold_more</span>;
    }
    return sortConfig.direction === 'asc' ? (
      <span className='material-symbols-outlined text-[14px] ml-1 text-primary'>arrow_upward</span>
    ) : (
      <span className='material-symbols-outlined text-[14px] ml-1 text-primary'>arrow_downward</span>
    );
  };

  return (
    <div className='bg-surface-container-lowest border border-outline-variant rounded-lg shadow-sm flex flex-col'>
      <div className='p-4 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <h3 className='font-headline-md text-headline-md font-bold text-on-surface'>Snacks SKU Performance</h3>
        <div className='relative w-full sm:w-64'>
          <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-[20px]'>
            search
          </span>
          <input
            type='text'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border border-outline-variant rounded-DEFAULT font-body-md text-body-md focus:outline-none focus:border-on-surface transition-colors'
            placeholder='Search SKUs...'
          />
        </div>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='bg-surface-container-low font-label-bold text-label-bold text-secondary uppercase border-b border-outline-variant'>
              <th className='p-4 font-semibold cursor-pointer select-none' onClick={() => handleSort('sku_name')}>
                <div className='flex items-center'>
                  SKU Name {renderSortIcon('sku_name')}
                </div>
              </th>
              <th className='p-4 font-semibold cursor-pointer select-none' onClick={() => handleSort('current_sales')}>
                <div className='flex items-center'>
                  Sales {renderSortIcon('current_sales')}
                </div>
              </th>
              <th className='p-4 font-semibold cursor-pointer select-none' onClick={() => handleSort('sales_per_linear_ft')}>
                <div className='flex items-center'>
                  Sales/Ln Ft {renderSortIcon('sales_per_linear_ft')}
                </div>
              </th>
              <th className='p-4 font-semibold cursor-pointer select-none' onClick={() => handleSort('private_brand')}>
                <div className='flex items-center'>
                  PB {renderSortIcon('private_brand')}
                </div>
              </th>
              <th className='p-4 font-semibold cursor-pointer select-none' onClick={() => handleSort('in_stock_rate')}>
                <div className='flex items-center'>
                  In-Stock {renderSortIcon('in_stock_rate')}
                </div>
              </th>
              <th className='p-4 font-semibold cursor-pointer select-none' onClick={() => handleSort('action')}>
                <div className='flex items-center'>
                  Recommendation {renderSortIcon('action')}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className='font-body-sm-tabular text-body-sm-tabular divide-y divide-outline-variant'>
            {filteredAndSortedSKUs.length === 0 ? (
              <tr>
                <td colSpan='6' className='p-8 text-center text-secondary'>
                  No SKUs found matching search criteria.
                </td>
              </tr>
            ) : (
              filteredAndSortedSKUs.map((sku) => (
                <tr key={sku.sku_name} className='hover:bg-surface-container-low transition-colors'>
                  <td className='p-4 text-on-surface font-medium'>{sku.sku_name}</td>
                  <td className='p-4'>${sku.current_sales.toLocaleString()}</td>
                  <td className='p-4'>${sku.sales_per_linear_ft.toFixed(2)}</td>
                  <td className='p-4'>
                    {sku.private_brand ? (
                      <span className='font-bold text-primary'>Yes</span>
                    ) : (
                      <span className='text-secondary'>No</span>
                    )}
                  </td>
                  <td className='p-4'>{sku.in_stock_rate.toFixed(1)}%</td>
                  <td className='p-4'>
                    <Badge text={sku.action} />
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
