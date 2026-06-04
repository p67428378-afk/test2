import React, { useState, useEffect } from 'react';
import { getAccounts } from '../services/api';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import AccountSummaryCard from '../components/Accounts/AccountSummaryCard';

const DashboardPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await getAccounts();
        setAccounts(response.data);
      } catch (err) {
        setError('Failed to fetch accounts. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-surface p-8">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold text-on-surface mb-6">Account Overview</h2>
            {loading && <p>Loading accounts...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.map(account => (
                  <AccountSummaryCard key={account.account_id} account={account} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
