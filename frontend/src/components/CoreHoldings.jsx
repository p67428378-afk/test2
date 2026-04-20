import React from 'react';

const CoreHoldings = () => {
  const holdings = [
    { name: 'Reliance Industries', ticker: 'RELIANCE', quantity: '45,000', price: '$32.14', value: '$1,446,300' },
    { name: 'TATA Consultancy Svcs', ticker: 'TCS', quantity: '12,400', price: '$48.90', value: '$606,360' },
    { name: 'HDFC Bank Ltd', ticker: 'HDFCBANK', quantity: '82,000', price: '$19.22', value: '$1,576,040' },
    { name: 'Infosys Limited', ticker: 'INFY', quantity: '31,000', price: '$22.45', value: '$695,950' },
  ];

  return (
    <div className='col-span-12 lg:col-span-8 bg-surface-container-lowest overflow-hidden'>
      <div className='p-8 border-b border-surface-container-high flex justify-between items-center'>
        <h3 className='text-xl font-bold font-headline'>Core Holdings</h3>
        <div className='flex gap-2'>
          <button className='p-2 hover:bg-surface-container rounded transition-colors'><span className='material-symbols-outlined text-slate-400'>filter_list</span></button>
          <button className='p-2 hover:bg-surface-container rounded transition-colors'><span className='material-symbols-outlined text-slate-400'>download</span></button>
        </div>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='bg-surface-container-low'>
              <th className='px-8 py-4 text-[10px] font-bold text-on-surface-variant uppercase'>Asset Name</th>
              <th className='px-8 py-4 text-[10px] font-bold text-on-surface-variant uppercase'>Ticker</th>
              <th className='px-8 py-4 text-[10px] font-bold text-on-surface-variant uppercase'>Quantity</th>
              <th className='px-8 py-4 text-[10px] font-bold text-on-surface-variant uppercase'>Price</th>
              <th className='px-8 py-4 text-[10px] font-bold text-on-surface-variant uppercase text-right'>Total Value</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-surface-container'>
            {holdings.map((holding, index) => (
              <tr key={index} className='hover:bg-surface-container-low transition-colors group'>
                <td className='px-8 py-5 flex items-center gap-3'>
                  <div className='w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px]'>{holding.name.charAt(0)}</div>
                  <span className='text-sm font-semibold'>{holding.name}</span>
                </td>
                <td className='px-8 py-5 text-sm text-on-surface-variant'>{holding.ticker}</td>
                <td className='px-8 py-5 text-sm'>{holding.quantity}</td>
                <td className='px-8 py-5 text-sm font-body'>{holding.price}</td>
                <td className='px-8 py-5 text-sm font-bold text-right'>{holding.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoreHoldings;
