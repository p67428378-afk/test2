import React from 'react';
import Badge from '../common/Badge';

const SKUDataTable = ({
  items = [],
  total = 0,
  page = 1,
  limit = 10,
  onPageChange,
  onSort,
  sortBy,
  actionsEnabled = false,
  selectedActions = {},
  onActionChange,
}) => {
  const handleSort = (field) => {
    if (!onSort) return;
    const isDesc = sortBy === field;
    onSort(isDesc ? `-${field}` : field);
  };

  const renderSortIcon = (field) => {
    if (sortBy === field) return ' ↓';
    if (sortBy === `-${field}`) return ' ↑';
    return '';
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className='bg-surface-container rounded-lg border border-outline-variant/30 overflow-hidden'>
      <div className='p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-high'>
        <h3 className='text-sm font-semibold text-on-surface'>SKU Performance &amp; Recommendations</h3>
        <button className='text-primary-container hover:bg-primary-container/10 px-3 py-1 rounded transition-colors flex items-center text-xs font-semibold'>
          <span className='material-symbols-outlined text-sm mr-1'>download</span> Export
        </button>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='border-b border-surface-variant bg-surface-container-high/50 text-xs font-semibold text-on-surface-variant uppercase tracking-wider'>
              <th className='p-4 py-2 w-[120px] cursor-pointer' onClick={() => handleSort('sku_id')}>
                SKU ID{renderSortIcon('sku_id')}
              </th>
              <th className='p-4 py-2 cursor-pointer' onClick={() => handleSort('name')}>
                Product Name{renderSortIcon('name')}
              </th>
              <th className='p-4 py-2 w-[150px] cursor-pointer' onClick={() => handleSort('brand')}>
                Brand{renderSortIcon('brand')}
              </th>
              <th className='p-4 py-2 w-[120px] text-right cursor-pointer' onClick={() => handleSort('sales')}>
                Sales (12W){renderSortIcon('sales')}
              </th>
              <th className='p-4 py-2 w-[100px] text-right cursor-pointer' onClick={() => handleSort('gm_pct')}>
                Margin %{renderSortIcon('gm_pct')}
              </th>
              <th className='p-4 py-2 w-[120px] text-center'>Status</th>
              {actionsEnabled && <th className='p-4 py-2 w-[180px] text-center'>Assortment Action</th>}
            </tr>
          </thead>
          <tbody className='font-mono text-xs text-on-surface divide-y divide-surface-variant/50'>
            {items.map((item) => (
              <tr key={item.sku_id} className='hover:bg-surface-container-highest transition-colors group'>
                <td className='p-4 py-3 text-secondary'>{item.sku_id.substring(0, 8).toUpperCase()}</td>
                <td className='p-4 py-3 font-sans text-sm truncate max-w-[250px]'>{item.name}</td>
                <td className='p-4 py-3 text-on-surface-variant font-sans text-sm'>{item.brand}</td>
                <td className='p-4 py-3 text-right'>${item.sales.toLocaleString()}</td>
                <td className='p-4 py-3 text-right text-green-status'>{item.gm_pct}%</td>
                <td className='p-4 py-3 text-center'>
                  <Badge status={item.status_badge} />
                </td>
                {actionsEnabled && (
                  <td className='p-4 py-2 text-center font-sans'>
                    <select
                      value={selectedActions[item.sku_id] || 'KEEP'}
                      onChange={(e) => onActionChange && onActionChange(item.sku_id, e.target.value)}
                      className='bg-background border border-outline-variant text-on-surface text-xs rounded px-2 py-1 focus:ring-1 focus:ring-primary-container focus:border-primary-container'
                    >
                      <option value='KEEP'>KEEP</option>
                      <option value='ADD'>ADD</option>
                      <option value='SWAP'>SWAP</option>
                      <option value='REMOVE'>REMOVE</option>
                    </select>
                  </td>
                )}
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={actionsEnabled ? 7 : 6} className='p-8 text-center text-on-surface-variant font-sans'>
                  No SKUs found matching the criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className='p-4 border-t border-outline-variant flex justify-between items-center bg-surface-container'>
        <p className='text-xs text-on-surface-variant font-sans'>
          Showing {items.length > 0 ? (page - 1) * limit + 1 : 0}-{Math.min(page * limit, total)} of {total} SKUs
        </p>
        <div className='flex space-x-1'>
          <button
            onClick={() => onPageChange && onPageChange(page - 1)}
            disabled={page <= 1}
            className='p-1 rounded text-on-surface-variant hover:bg-surface-container-highest disabled:opacity-50'
          >
            <span className='material-symbols-outlined text-sm'>chevron_left</span>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => onPageChange && onPageChange(p)}
              className={`w-6 h-6 rounded font-semibold text-xs flex items-center justify-center ${
                p === page
                  ? 'bg-primary-container text-on-primary-container'
                  : 'text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => onPageChange && onPageChange(page + 1)}
            disabled={page >= totalPages}
            className='p-1 rounded text-on-surface-variant hover:bg-surface-container-highest disabled:opacity-50'
          >
            <span className='material-symbols-outlined text-sm'>chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SKUDataTable;
