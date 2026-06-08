import React from 'react';

export default function RecentRevenueTable({ streams }) {
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '$0.00';
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
  };

  const defaultStreams = [
    { source: 'Customs & Excise', category: 'Trade Tax', amount: 1200000000, status: 'On Track', lastUpdated: 'Today, 09:41 AM' },
    { source: 'Corporate Tax', category: 'Direct Tax', amount: 3400000000, status: 'On Track', lastUpdated: 'Yesterday, 14:20 PM' },
    { source: 'Value Added Tax (VAT)', category: 'Consumption Tax', amount: 850000000, status: 'Delayed', lastUpdated: 'Oct 24, 2023' },
    { source: 'Petroleum Tax', category: 'Resource Tax', amount: 2100000000, status: 'On Track', lastUpdated: 'Oct 23, 2023' },
    { source: 'Import Duties', category: 'Trade Tax', amount: 420000000, status: 'Delayed', lastUpdated: 'Oct 22, 2023' },
  ];

  const displayStreams = streams || defaultStreams;

  return (
    <div className='bg-surface-container border border-outline-variant rounded-lg overflow-hidden'>
      <div className='p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-high'>
        <h3 className='text-headline-md font-headline-md text-on-surface'>Recent Revenue Streams</h3>
        <button className='text-primary hover:text-primary-container text-label-md font-label-md transition-colors uppercase'>View All</button>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='bg-surface-container-highest'>
              <th className='px-md py-sm text-label-md font-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant'>Source</th>
              <th className='px-md py-sm text-label-md font-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant'>Category</th>
              <th className='px-md py-sm text-label-md font-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant text-right'>Amount</th>
              <th className='px-md py-sm text-label-md font-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant'>Status</th>
              <th className='px-md py-sm text-label-md font-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant'>Last Updated</th>
            </tr>
          </thead>
          <tbody className='text-body-md font-body-md divide-y divide-outline-variant'>
            {displayStreams.map((stream, index) => (
              <tr key={index} className='hover:bg-surface-bright transition-colors group'>
                <td className='px-md py-sm text-on-surface font-medium'>{stream.source}</td>
                <td className='px-md py-sm text-on-surface-variant'>{stream.category || 'Tax'}</td>
                <td className='px-md py-sm text-on-surface text-right font-mono'>{formatCurrency(stream.amount)}</td>
                <td className='px-md py-sm'>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-label-sm font-label-sm border ${
                    stream.status === 'On Track' || stream.status === 'Received'
                      ? 'bg-secondary/10 text-secondary border-secondary/20'
                      : 'bg-tertiary/10 text-tertiary border-tertiary/20'
                  }`}>
                    {stream.status}
                  </span>
                </td>
                <td className='px-md py-sm text-on-surface-variant text-label-md'>{stream.lastUpdated || 'Recently'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
