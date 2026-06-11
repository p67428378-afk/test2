import React, { useState, useEffect } from 'react';
import { transactionService, accountService } from '../services/api';
import TransactionTable from '../components/banking/TransactionTable';

export default function StatementsPage({ refreshTrigger }) {
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEnd_date] = useState('');
  const [selectedType, setSelectedType] = useState(''); // 'Incoming' or 'Outgoing' or ''
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const limit = 20;

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const accountsData = await accountService.getAccounts();
        setAccounts(accountsData);
      } catch (err) {
        console.error('Failed to load accounts:', err);
      }
    };
    fetchAccounts();
  }, []);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {
          limit,
          skip,
        };
        if (selectedAccount) params.account_id = selectedAccount;
        if (startDate) params.start_date = startDate;
        if (endDate) params.end_date = endDate;
        if (selectedType) params.type = selectedType;

        const data = await transactionService.getTransactions(params);
        setTransactions(data.items || []);
        setTotal(data.total || 0);
      } catch (err) {
        setError('Failed to load transactions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [selectedAccount, startDate, endDate, selectedType, skip, refreshTrigger]);

  const handleResetFilters = () => {
    setSelectedAccount('');
    setStartDate('');
    setEnd_date('');
    setSelectedType('');
    setSkip(0);
  };

  const handlePrevPage = () => {
    setSkip(prev => Math.max(0, prev - limit));
  };

  const handleNextPage = () => {
    setSkip(prev => (prev + limit < total ? prev + limit : prev));
  };

  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.ceil(total / limit) || 1;

  return (
    <div className="p-md lg:p-xl flex flex-col gap-lg">
      {/* Filters Section */}
      <div className="glass-card p-lg rounded-2xl flex flex-col gap-md">
        <h3 className="font-title-lg text-title-lg text-on-surface">Filter Transactions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-md">
          <div>
            <label className="font-label-sm text-on-surface-variant mb-2 block">Account</label>
            <select
              value={selectedAccount}
              onChange={(e) => { setSelectedAccount(e.target.value); setSkip(0); }}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-md text-on-surface focus:border-primary focus:ring-0 focus:outline-none"
            >
              <option value="">All Accounts</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.account_type} ({acc.account_number})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-label-sm text-on-surface-variant mb-2 block">Start Date</label>
            <input
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setSkip(0); }}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-md text-on-surface focus:border-primary focus:ring-0 focus:outline-none"
              type="date"
            />
          </div>

          <div>
            <label className="font-label-sm text-on-surface-variant mb-2 block">End Date</label>
            <input
              value={endDate}
              onChange={(e) => { setEnd_date(e.target.value); setSkip(0); }}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-md text-on-surface focus:border-primary focus:ring-0 focus:outline-none"
              type="date"
            />
          </div>

          <div>
            <label className="font-label-sm text-on-surface-variant mb-2 block">Type</label>
            <select
              value={selectedType}
              onChange={(e) => { setSelectedType(e.target.value); setSkip(0); }}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-md text-on-surface focus:border-primary focus:ring-0 focus:outline-none"
            >
              <option value="">All Types</option>
              <option value="Incoming">Incoming</option>
              <option value="Outgoing">Outgoing</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleResetFilters}
            className="bg-surface-container-high text-on-surface px-lg py-2 rounded-lg font-label-lg hover:brightness-110 active:scale-95 transition-all"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      {error ? (
        <div className="p-lg rounded-2xl bg-error-container text-on-error-container">
          {error}
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center h-64">
          <span className="material-symbols-outlined animate-spin text-primary text-4xl">sync</span>
        </div>
      ) : (
        <div className="flex flex-col gap-md">
          <TransactionTable transactions={transactions} limit={limit} />

          {/* Pagination Controls */}
          <div className="flex justify-between items-center p-md">
            <span className="text-sm text-on-surface-variant">
              Showing {skip + 1} - {Math.min(skip + limit, total)} of {total} transactions
            </span>
            <div className="flex gap-md">
              <button
                onClick={handlePrevPage}
                disabled={skip === 0}
                className="bg-surface-container-high text-on-surface px-lg py-2 rounded-lg font-label-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
              >
                Previous
              </button>
              <span className="flex items-center text-sm text-on-surface-variant">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={skip + limit >= total}
                className="bg-surface-container-high text-on-surface px-lg py-2 rounded-lg font-label-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
