import React from 'react';
import Badge from '../common/Badge';

export default function SKUPerformanceTable({ skus, loading }) {
  if (loading) {
    return (
      <div className='bg-[#1E293B] border border-[#334155] rounded-xl p-5 animate-pulse h-96'>
        <div className='h-6 bg-[#273647] rounded w-1/4 mb-4'></div>
        <div className='space-y-3'>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className='h-10 bg-[#273647] rounded'></div>
          ))}
        </div>
      </div>
    );
  }

  const items = skus || [];

  return (
    <div className='bg-[#1E293B] border border-[#334155] rounded-xl flex flex-col overflow-hidden'>
      <div className='px-5 py-4 border-b border-[#334155] flex justify-between items-center bg-[#1E293B]/80 backdrop-blur-sm'>
        <h3 className='text-lg font-semibold text-white'>Snacks SKU Performance</h3>
        <div className='flex gap-2'>
          <button className='text-[#d8c3ad] hover:text-white p-1 rounded transition-colors'>
            <span className='material-symbols-outlined' style={{ fontSize: '20px' }}>filter_list</span>
          </button>
          <button className='text-[#d8c3ad] hover:text-white p-1 rounded transition-colors'>
            <span className='material-symbols-outlined' style={{ fontSize: '20px' }}>download</span>
          </button>
        </div>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='border-b border-[#334155] bg-[#0F172A]/50'>
              <th className='px-5 py-3 text-xs font-semibold text-[#d8c3ad] uppercase tracking-wider'>SKU</th>
              <th className='px-5 py-3 text-xs font-semibold text-[#d8c3ad] uppercase tracking-wider'>Product Name</th>
              <th className='px-5 py-3 text-xs font-semibold text-[#d8c3ad] uppercase tracking-wider text-right'>Sales</th>
              <th className='px-5 py-3 text-xs font-semibold text-[#d8c3ad] uppercase tracking-wider text-right'>Sales Trend</th>
              <th className='px-5 py-3 text-xs font-semibold text-[#d8c3ad] uppercase tracking-wider text-center'>Status</th>
            </tr>
          </thead>
          <tbody className='text-sm text-[#d4e4fa]'>
            {items.length === 0 ? (
              <tr>
                <td colSpan='5' className='px-5 py-8 text-center text-[#d8c3ad]'>
                  No SKUs found.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.sku} className='border-b border-[#334155]/50 hover:bg-[#273647]/30 transition-colors'>
                  <td className='px-5 py-3 font-mono text-[#F59E0B]/80 text-sm'>{item.sku}</td>
                  <td className='px-5 py-3 font-medium text-white'>{item.name}</td>
                  <td className='px-5 py-3 font-mono text-right'>${Number(item.sales_volume || 0).toLocaleString()}</td>
                  <td className={`px-5 py-3 font-mono text-right ${item.sales_trend >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {item.sales_trend >= 0 ? '+' : ''}{item.sales_trend}%
                  </td>
                  <td className='px-5 py-3 text-center'>
                    <Badge status={item.status} />
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
