import React, { useState, useEffect } from 'react';
import InternalTransferForm from '../components/banking/InternalTransferForm';
import P2PTransferForm from '../components/banking/P2PTransferForm';
import { accountService, transactionService } from '../services/api';

export default function TransferPage({ refreshTrigger, setRefreshTrigger }) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dailyLimitRemaining, setDailyLimitRemaining] = useState(5000);
  const [activeSubTab, setActiveTab] = useState('internal'); // 'internal' or 'p2p'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountsData, transactionsData] = await Promise.all([
          accountService.getAccounts(),
          transactionService.getTransactions({ limit: 100 })
        ]);
        setAccounts(accountsData);

        // Calculate remaining daily limit
        const today = new Date().toISOString().split('T')[0];
        const todayP2PTransfers = (transactionsData.items || []).filter(tx => {
          const txDate = new Date(tx.created_at).toISOString().split('T')[0];
          return tx.type === 'P2P Transfer' && tx.direction === 'Outgoing' && txDate === today;
        });
        const todayP2PTotal = todayP2PTransfers.reduce((sum, tx) => sum + tx.amount, 0);
        setDailyLimitRemaining(Math.max(0, 5000 - todayP2PTotal));
      } catch (err) {
        setError('Failed to load accounts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshTrigger]);

  const handleTransferSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-lg rounded-2xl bg-error-container text-on-error-container m-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="p-md lg:p-xl flex flex-col gap-lg">
      {/* Tab Selector */}
      <div className="flex border-b border-outline-variant">
        <button
          onClick={() => setActiveTab('internal')}
          className={`px-lg py-md font-bold text-label-lg border-b-2 transition-all ${
            activeSubTab === 'internal'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Own Accounts
        </button>
        <button
          onClick={() => setActiveTab('p2p')}
          className={`px-lg py-md font-bold text-label-lg border-b-2 transition-all ${
            activeSubTab === 'p2p'
              ? 'border-primary text-primary'
              : 'border-transparent text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Pay Someone Else (P2P)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="lg:col-span-2">
          {activeSubTab === 'internal' ? (
            <InternalTransferForm
              accounts={accounts}
              onTransferSuccess={handleTransferSuccess}
            />
          ) : (
            <P2PTransferForm
              accounts={accounts}
              onTransferSuccess={handleTransferSuccess}
              dailyLimitRemaining={dailyLimitRemaining}
            />
          )}
        </div>

        {/* Account Summary Sidebar */}
        <div className="flex flex-col gap-lg">
          <div className="glass-card p-lg rounded-2xl">
            <h3 className="font-title-lg text-title-lg text-on-surface mb-md">Account Balances</h3>
            <div className="flex flex-col gap-md">
              {accounts.map((acc) => (
                <div key={acc.id} className="flex justify-between items-center border-b border-outline-variant pb-sm last:border-none">
                  <div>
                    <p className="font-label-lg text-label-lg capitalize">{acc.account_type}</p>
                    <p className="text-xs text-on-surface-variant">{acc.account_number}</p>
                  </div>
                  <p className="font-bold text-on-surface">${acc.balance.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {activeSubTab === 'p2p' && (
            <div className="glass-card p-lg rounded-2xl border-l-4 border-l-primary">
              <h4 className="font-label-lg text-label-lg text-primary mb-xs">Daily P2P Limit</h4>
              <p className="text-sm text-on-surface-variant mb-sm">
                A daily limit of $5,000.00 is enforced for security.
              </p>
              <div className="flex justify-between text-xs font-bold">
                <span>Remaining:</span>
                <span>${dailyLimitRemaining.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
