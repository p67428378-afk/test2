import React from 'react';

const TransactionTable = ({ transactions, currency }) => {
  const formatCurrency = (value) => {
    const symbol = currency === 'INR' ? '₹' : '$';
    return `${symbol}${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className='bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant flex flex-col overflow-hidden h-full'>
      <div className='p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low'>
        <h3 className='font-headline-sm text-headline-sm text-on-background'>Recent Transactions</h3>
        <span className='text-[10px] font-mono text-outline-variant border border-outline-variant px-2 rounded'>RBI Compliant</span>
      </div>
      <div className='overflow-x-auto flex-1'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='bg-surface-bright border-b border-surface-variant font-label-md text-[11px] text-on-surface-variant uppercase'>
              <th className='p-3 font-semibold'>Date</th>
              <th className='p-3 font-semibold'>Description</th>
              <th className='p-3 font-semibold'>Type</th>
              <th className='p-3 font-semibold text-right'>Amount</th>
            </tr>
          </thead>
          <tbody className='font-data-mono text-[12px] divide-y divide-surface-variant'>
            {transactions && transactions.length > 0 ? (
              transactions.map((tx) => (
                <tr key={tx.id} className='hover:bg-surface-bright transition-colors'>
                  <td className='p-3 text-outline'>
                    {new Date(tx.timestamp).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className='p-3 text-on-background font-medium'>{tx.description}</td>
                  <td className='p-3'>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.type === 'CREDIT'
                          ? 'text-[#166534] bg-[#dcfce7]'
                          : 'text-error bg-error-container'
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td
                    className={`p-3 text-right font-bold ${
                      tx.type === 'CREDIT' ? 'text-[#166534]' : 'text-error'
                    }`}
                  >
                    {tx.type === 'CREDIT' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='4' className='p-4 text-center text-outline'>
                  No recent transactions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
