
import React, { useState, useEffect } from 'react';
import AccountCard from './AccountCard';
import { getAccounts } from '../services/api';

const Portfolio = () => {
  const [accounts, setAccounts] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await getAccounts();
        setAccounts(response.data);
        const total = response.data.reduce((sum, account) => sum + account.balance, 0);
        setTotalBalance(total);
      } catch (error) {
        setError('Failed to fetch accounts. Please try again later.');
        console.error('Error fetching accounts:', error);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <div>
      <header className='mb-12 flex justify-between items-end'>
        <div>
          <span className='font-label text-sm uppercase tracking-[0.2em] text-on-surface-variant font-semibold'>Total Portfolio Value</span>
          <h2 className='font-headline text-5xl font-extrabold tracking-tighter text-primary mt-2'>
            ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className='text-primary-container font-light'></span>
          </h2>
        </div>
        <div className='flex items-center space-x-4'>
          <div className='px-4 py-2 bg-primary-fixed text-on-primary-fixed-variant rounded-full font-label text-xs font-bold uppercase flex items-center space-x-2'>
            <span className='material-symbols-outlined text-sm' style={{ fontVariationSettings: '\'FILL\' 1' }}>trending_up</span>
            <span>+12.4% vs last month</span>
          </div>
        </div>
      </header>

      {error && <div className="col-span-12 text-red-500">{error}</div>}

      <div className='grid grid-cols-12 gap-8'>
        {accounts.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
