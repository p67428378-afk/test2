
import React from 'react';

const AccountSelector = ({ selectedAccount, setAccountNumber }) => {
  const accounts = [
    {
      name: 'Primary Savings',
      id: '1234567890',
      balance: '1,420,500.00',
      type: 'Default'
    },
    {
      name: 'Investment Portfolio',
      id: '0987654321',
      balance: '3,842,210.50',
      type: 'Secondary'
    }
  ];

  return (
    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0_8px_32px_rgba(25,28,30,0.04)] h-full">
      <h3 className="font-headline font-bold text-lg mb-6 flex items-center gap-2">
        <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
        Select Account
      </h3>
      <div className="space-y-4">
        {accounts.map((account) => (
          <div
            key={account.id}
            onClick={() => setAccountNumber(account.id)}
            className={`group relative p-5 rounded-lg border-2 cursor-pointer active:scale-[0.98] transition-all ${
              selectedAccount === account.id
                ? 'border-primary-container bg-surface-container-low'
                : 'bg-surface hover:bg-surface-container-low border-transparent'
            }`}>
            <div className="flex justify-between items-start mb-4">
              <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider ${
                account.type === 'Default' ? 'bg-primary-container text-white' : 'bg-surface-container-high text-on-surface-variant'
              }`}>{account.type}</span>
              {selectedAccount === account.id && (
                <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>
              )}
            </div>
            <p className="font-headline font-bold text-on-surface">{account.name}</p>
            <p className="font-body text-xs text-on-surface-variant mt-1">Vault ID: •••• {account.id.slice(-4)}</p>
            <p className="font-headline font-extrabold text-xl mt-4 text-primary">${account.balance}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountSelector;
