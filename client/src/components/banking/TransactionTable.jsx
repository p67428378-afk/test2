import React from 'react';

export default function TransactionTable({ transactions, limit = 5, onViewAll }) {
  const formatCurrency = (amount, direction) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
    return direction === 'Incoming' ? `+${formatted}` : `-${formatted}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const getEntityIcon = (type, direction) => {
    if (direction === 'Incoming') {
      return type === 'P2P Transfer' ? 'person' : 'payments';
    }
    if (type?.toLowerCase().includes('coffee')) return 'local_cafe';
    if (type?.toLowerCase().includes('market') || type?.toLowerCase().includes('foods')) return 'shopping_basket';
    if (type?.toLowerCase().includes('electric') || type?.toLowerCase().includes('utility')) return 'bolt';
    return 'payments';
  };

  const getEntityName = (tx) => {
    if (tx.type === 'Internal Transfer') {
      return `Transfer to ${tx.to_account_number}`;
    }
    if (tx.type === 'P2P Transfer') {
      return tx.direction === 'Incoming' 
        ? `From ${tx.from_account_number || 'Customer'}` 
        : `To ${tx.to_account_number}`;
    }
    return tx.memo || tx.type || 'Transaction';
  };

  const displayTransactions = transactions.slice(0, limit);

  return (
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col h-full">
      <div className="p-lg border-b border-outline-variant flex justify-between items-center">
        <h2 className="font-headline-md text-headline-md text-on-surface">Recent Transactions</h2>
        {onViewAll && (
          <button onClick={onViewAll} className="text-primary font-label-lg hover:underline">
            View All
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-surface-container-low">
              <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider">Entity</th>
              <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider">Date</th>
              <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider">Type</th>
              <th className="px-lg py-md font-label-sm text-on-surface-variant uppercase tracking-wider text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {displayTransactions.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-lg py-xl text-center text-on-surface-variant">
                  No transactions found.
                </td>
              </tr>
            ) : (
              displayTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-lg py-md">
                    <div className="flex items-center gap-md">
                      <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-surface-variant">
                          {getEntityIcon(tx.type, tx.direction)}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-lg text-label-lg">{getEntityName(tx)}</span>
                        {tx.memo && <span className="text-xs text-on-surface-variant">{tx.memo}</span>}
                      </div>
                    </div>
                  </td>
                  <td className="px-lg py-md font-body-md text-on-surface-variant">
                    {formatDate(tx.created_at)}
                  </td>
                  <td className="px-lg py-md">
                    <span
                      className={`px-sm py-1 rounded-full text-label-sm ${
                        tx.direction === 'Incoming'
                          ? 'bg-secondary/10 text-secondary'
                          : 'bg-tertiary-container/10 text-tertiary'
                      }`}
                    >
                      {tx.direction}
                    </span>
                  </td>
                  <td
                    className={`px-lg py-md text-right font-label-lg ${
                      tx.direction === 'Incoming' ? 'text-secondary' : 'text-tertiary'
                    }`}
                  >
                    {formatCurrency(tx.amount, tx.direction)}
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
