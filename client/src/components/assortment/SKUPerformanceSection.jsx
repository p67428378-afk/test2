import React from 'react';

export default function SKUPerformanceSection({
  skus,
  search,
  setSearch,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  page,
  setPage,
  total,
  limit,
  skuActions,
  onActionChange,
}) {
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const getBadgeClass = (action) => {
    switch (action?.toUpperCase()) {
      case 'GROW':
        return 'badge-green';
      case 'MAINTAIN':
        return 'badge-blue';
      case 'REDUCE':
        return 'badge-red';
      case 'SWAP':
        return 'badge-orange';
      default:
        return 'badge-gray';
    }
  };

  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className='bg-surface-container-lowest border border-gray rounded-lg card-shadow overflow-hidden'>
      <div className='p-4 border-b border-gray flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-container-low'>
        <h2 className='font-headline-sm text-headline-sm dark-slate'>SKU Performance</h2>
        <div className='flex items-center gap-3 w-full sm:w-auto'>
          <div className='relative w-full sm:w-64'>
            <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]'>
              search
            </span>
            <input
              className='w-full bg-surface-container-lowest border border-gray rounded-lg py-2 pl-10 pr-4 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-transparent'
              placeholder='Search SKUs...'
              type='text'
              value={search}
              onChange={handleSearchChange}
            />
          </div>
          <button
            onClick={() => handleSort('status')}
            className='flex items-center gap-2 px-3 py-2 border border-gray rounded-lg bg-surface-container-lowest hover:bg-surface-container transition-colors text-body-md font-medium text-on-surface'
          >
            <span className='material-symbols-outlined text-[20px]'>filter_list</span>
            Sort Status
          </button>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='bg-[#F1F5F9] border-b border-gray font-label-md text-label-md text-on-secondary-container uppercase'>
              <th
                className='py-3 px-4 font-semibold cursor-pointer hover:bg-slate-200 transition-colors'
                onClick={() => handleSort('sku_name')}
              >
                <div className='flex items-center gap-1'>
                  SKU Description
                  {sortBy === 'sku_name' && (
                    <span className='material-symbols-outlined text-xs'>
                      {sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                    </span>
                  )}
                </div>
              </th>
              <th
                className='py-3 px-4 font-semibold cursor-pointer hover:bg-slate-200 transition-colors'
                onClick={() => handleSort('sales_velocity')}
              >
                <div className='flex items-center gap-1'>
                  Sales Vel
                  {sortBy === 'sales_velocity' && (
                    <span className='material-symbols-outlined text-xs'>
                      {sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                    </span>
                  )}
                </div>
              </th>
              <th
                className='py-3 px-4 font-semibold cursor-pointer hover:bg-slate-200 transition-colors'
                onClick={() => handleSort('margin_pct')}
              >
                <div className='flex items-center gap-1'>
                  Margin
                  {sortBy === 'margin_pct' && (
                    <span className='material-symbols-outlined text-xs'>
                      {sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                    </span>
                  )}
                </div>
              </th>
              <th
                className='py-3 px-4 font-semibold cursor-pointer hover:bg-slate-200 transition-colors'
                onClick={() => handleSort('current_inventory')}
              >
                <div className='flex items-center gap-1'>
                  Inv On Hand
                  {sortBy === 'current_inventory' && (
                    <span className='material-symbols-outlined text-xs'>
                      {sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward'}
                    </span>
                  )}
                </div>
              </th>
              <th className='py-3 px-4 font-semibold text-right'>Recommendation</th>
            </tr>
          </thead>
          <tbody className='font-body-md text-body-md text-on-surface'>
            {skus && skus.length > 0 ? (
              skus.map((sku) => {
                const currentAction = skuActions[sku.id] || sku.status;
                return (
                  <tr
                    key={sku.id}
                    className='border-b border-gray hover:bg-surface-container transition-colors h-12'
                  >
                    <td className='py-3 px-4 font-medium'>{sku.sku_name}</td>
                    <td className='py-3 px-4'>{sku.sales_velocity} units/wk</td>
                    <td className='py-3 px-4'>{(sku.margin_pct * 100).toFixed(0)}%</td>
                    <td className='py-3 px-4'>{sku.current_inventory} units</td>
                    <td className='py-3 px-4 text-right'>
                      <select
                        value={currentAction}
                        onChange={(e) => onActionChange(sku.id, e.target.value)}
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border-none focus:ring-2 focus:ring-primary-container cursor-pointer ${getBadgeClass(
                          currentAction
                        )}`}
                        style={{
                          WebkitAppearance: 'none',
                          MozAppearance: 'none',
                          appearance: 'none',
                          textAlign: 'center',
                          textAlignLast: 'center',
                          paddingRight: '0.5rem',
                          paddingLeft: '0.5rem',
                        }}
                      >
                        <option value='GROW'>GROW</option>
                        <option value='MAINTAIN'>MAINTAIN</option>
                        <option value='REDUCE'>REDUCE</option>
                        <option value='SWAP'>SWAP</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan='5' className='py-8 text-center text-on-surface-variant'>
                  No SKUs found matching the criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className='p-4 border-t border-gray flex items-center justify-between bg-surface-container-lowest'>
        <div className='font-body-md text-body-md text-on-surface-variant'>
          Showing {skus.length > 0 ? (page - 1) * limit + 1 : 0}-
          {Math.min(page * limit, total)} of {total} SKUs
        </div>
        <div className='flex gap-2'>
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className='px-3 py-1 border border-gray rounded text-body-md text-on-surface-variant hover:bg-surface-container transition-colors disabled:opacity-50'
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className='px-3 py-1 border border-gray rounded text-body-md text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50'
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
