import React from 'react';

export default function SkuPerformanceTable({ skus, loading }) {
  const getBadgeClass = (action) => {
    const act = action?.toUpperCase();
    if (act === 'GROW') {
      return 'bg-[#10B981]/10 text-[#10B981]';
    } else if (act === 'MAINTAIN') {
      return 'bg-[#3B82F6]/10 text-[#3B82F6]';
    } else if (act === 'SWAP') {
      return 'bg-[#F59E0B]/10 text-[#F59E0B]';
    } else if (act === 'REDUCE') {
      return 'bg-[#ba1a1a]/10 text-[#ba1a1a]';
    }
    return 'bg-gray-100 text-gray-600';
  };

  return (
    <div className='bg-white border border-[#d1c6ab]/50 rounded-xl overflow-hidden flex flex-col shadow-sm'>
      <div className='p-5 border-b border-[#d1c6ab]/30 flex justify-between items-center bg-[#f8f9ff]'>
        <h3 className='text-lg font-bold text-[#0b1c30]'>SKU Performance</h3>
        <button className='text-xs text-[#725c00] font-bold hover:underline flex items-center gap-1'>
          View Full Catalog <span className='material-symbols-outlined text-[16px]'>arrow_forward</span>
        </button>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='bg-[#F1F5F9] border-b border-[#d1c6ab]/30 text-xs text-[#4d4632] uppercase tracking-wider'>
              <th className='px-5 py-3 font-semibold'>SKU ID</th>
              <th className='px-5 py-3 font-semibold'>Product Name</th>
              <th className='px-5 py-3 font-semibold text-right'>Wkly Sales</th>
              <th className='px-5 py-3 font-semibold text-right'>Margin</th>
              <th className='px-5 py-3 font-semibold text-right'>DOS</th>
              <th className='px-5 py-3 font-semibold text-center'>Status</th>
            </tr>
          </thead>
          <tbody className='text-sm text-[#0b1c30] divide-y divide-[#d1c6ab]/20 font-mono'>
            {loading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <tr key={i} className='animate-pulse h-12'>
                  <td className='px-5 py-3'><div className='h-4 bg-gray-200 rounded w-2/3'></div></td>
                  <td className='px-5 py-3'><div className='h-4 bg-gray-200 rounded w-3/4'></div></td>
                  <td className='px-5 py-3'><div className='h-4 bg-gray-200 rounded w-1/2 ml-auto'></div></td>
                  <td className='px-5 py-3'><div className='h-4 bg-gray-200 rounded w-1/3 ml-auto'></div></td>
                  <td className='px-5 py-3'><div className='h-4 bg-gray-200 rounded w-1/4 ml-auto'></div></td>
                  <td className='px-5 py-3'><div className='h-6 bg-gray-200 rounded-full w-16 mx-auto'></div></td>
                </tr>
              ))
            ) : (
              skus?.map((sku) => (
                <tr key={sku.id} className='hover:bg-[#FFFBEB] transition-colors group h-[48px]'>
                  <td className='px-5 py-3 text-[#4d4632]/70 text-xs truncate max-w-[120px]' title={sku.id}>
                    {sku.id.substring(0, 8).toUpperCase()}...
                  </td>
                  <td className='px-5 py-3 font-medium font-sans'>{sku.name}</td>
                  <td className='px-5 py-3 text-right'>${sku.weekly_sales?.toLocaleString()}</td>
                  <td className='px-5 py-3 text-right'>{sku.profit_margin}%</td>
                  <td className='px-5 py-3 text-right'>{sku.days_of_supply}</td>
                  <td className='px-5 py-3 text-center'>
                    <span className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${getBadgeClass(sku.recommended_action)}`}>
                      {sku.recommended_action}
                    </span>
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
