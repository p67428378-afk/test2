import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAccountTransactions } from '../services/api';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import TransactionTable from '../components/Transactions/TransactionTable';

const AccountDetailsPage = () => {
  const { accountId } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await getAccountTransactions(accountId);
        setTransactions(response.data);
      } catch (err) {
        setError('Failed to fetch transaction history.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [accountId]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-surface p-8">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold text-on-surface mb-6">Transaction History</h2>
            <h3 className="text-lg font-medium text-on-surface-variant mb-4">Account: {accountId}</h3>
            {loading && <p>Loading transactions...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
              <TransactionTable transactions={transactions} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountDetailsPage;
