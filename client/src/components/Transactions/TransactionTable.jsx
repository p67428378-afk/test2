import React from 'react';

const TransactionTable = ({ transactions }) => {

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  if (!transactions || transactions.length === 0) {
    return <p className="text-center text-on-surface-variant">No transactions found for this account.</p>;
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-lg shadow-sm overflow-hidden">
      <table className="min-w-full divide-y divide-outline-variant/20">
        <thead className="bg-surface-container-low">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">Date</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">Description</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-on-surface-variant uppercase tracking-wider">Type</th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-on-surface-variant uppercase tracking-wider">Amount</th>
          </tr>
        </thead>
        <tbody className="bg-surface-container-lowest divide-y divide-outline-variant/10">
          {transactions.map((tx) => (
            <tr key={tx.transaction_id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface">{formatDate(tx.transaction_date)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface">{tx.description}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-on-surface capitalize">{tx.type}</td>
              <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                {tx.type === 'deposit' ? '+' : '-'} {formatCurrency(Math.abs(tx.amount))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
