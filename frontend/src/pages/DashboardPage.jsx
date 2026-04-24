import React, { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import AccountSummaryCard from '../components/accounts/AccountSummaryCard';
import ErrorMessage from '../components/common/ErrorMessage';
import { getAccountSummary } from '../services/api';

const DashboardPage = () => {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccountSummary = async () => {
      try {
        const response = await getAccountSummary();
        setAccount(response.data);
      } catch (err) {
        setError('Failed to fetch account summary. Please try again later.');
      }
    };

    fetchAccountSummary();
  }, []);

  return (
    <AppLayout>
      <div className='max-w-4xl mx-auto'>
        {error && <ErrorMessage message={error} />}
        {account && <AccountSummaryCard account={account} />}
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
