import React, { useState, useEffect } from 'react';
import AccountCard from '../components/banking/AccountCard';
import TransactionTable from '../components/banking/TransactionTable';
import InternalTransferForm from '../components/banking/InternalTransferForm';
import { accountService, transactionService } from '../services/api';

export default function DashboardPage({ setActiveTab, refreshTrigger, setRefreshTrigger }) {
  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dailyLimitRemaining, setDailyLimitRemaining] = useState(5000);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accountsData, transactionsData] = await Promise.all([
          accountService.getAccounts(),
          transactionService.getTransactions({ limit: 5 })
        ]);
        setAccounts(accountsData);
        setTransactions(transactionsData.items || []);

        // Calculate remaining daily limit
        // In a real app, we would fetch this from the backend.
        // Let's calculate it from today's P2P transfers in transactionsData.
        const today = new Date().toISOString().split('T')[0];
        const todayP2PTransfers = (transactionsData.items || []).filter(tx => {
          const txDate = new Date(tx.created_at).toISOString().split('T')[0];
          return tx.type === 'P2P Transfer' && tx.direction === 'Outgoing' && txDate === today;
        });
        const todayP2PTotal = todayP2PTransfers.reduce((sum, tx) => sum + tx.amount, 0);
        setDailyLimitRemaining(Math.max(0, 5000 - todayP2PTotal));
      } catch (err) {
        setError('Failed to load dashboard data. Please try again later.');
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

  const limitUsedPercent = ((5000 - dailyLimitRemaining) / 5000) * 100;

  return (
    <div className="p-md lg:p-xl flex flex-col gap-xl">
      {/* Limit Banner */}
      <section className="glass-card p-lg rounded-2xl border-l-4 border-l-primary flex flex-col md:flex-row md:items-center justify-between gap-md">
        <div className="flex items-center gap-md">
          <div className="bg-primary/20 p-2 rounded-lg">
            <span className="material-symbols-outlined text-primary">info</span>
          </div>
          <div>
            <h3 className="font-title-lg text-title-lg text-on-surface">Daily P2P Limit</h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Daily P2P Limit $5,000.00, Remaining ${dailyLimitRemaining.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="flex-grow max-w-xs">
          <div className="flex justify-between mb-1">
            <span className="text-label-sm text-on-surface-variant">{limitUsedPercent.toFixed(0)}% Used</span>
            <span className="text-label-sm text-primary font-bold">Remaining: ${dailyLimitRemaining.toFixed(2)}</span>
          </div>
          <div className="w-full bg-surface-container-highest rounded-full h-2">
            <div className="bg-primary h-2 rounded-full" style={{ width: `${Math.max(1, limitUsedPercent)}%` }}></div>
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        {/* Account Cards (Left Column) */}
        <div className="lg:col-span-8 flex flex-col gap-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {accounts.map((acc) => (
              <AccountCard key={acc.id} account={acc} />
            ))}
          </div>

          {/* Recent Transactions */}
          <TransactionTable
            transactions={transactions}
            limit={5}
            onViewAll={() => setActiveTab('statements')}
          />
        </div>

        {/* Right Column (Quick Transfer & Cards) */}
        <div className="lg:col-span-4 flex flex-col gap-lg">
          {/* Quick Transfer Form */}
          <InternalTransferForm
            accounts={accounts}
            onTransferSuccess={handleTransferSuccess}
          />

          {/* Marketing/Atmospheric Section */}
          <div className="glass-card rounded-2xl overflow-hidden relative min-h-[240px] flex flex-col justify-end p-lg">
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-surface-container-low to-transparent opacity-80"></div>
            <div className="relative z-10">
              <h3 className="font-title-lg text-title-lg text-primary font-bold mb-xs">Premium Insights</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-md">
                Unlock detailed financial analytics and predictive spending reports with Apex Gold.
              </p>
              <button className="text-primary font-label-lg flex items-center gap-xs hover:gap-md transition-all">
                Learn More
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
