import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import { accountService, authService } from '../services/api';

const DashboardPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchAccounts = async () => {
      try {
        const data = await accountService.getAccounts();
        setAccounts(data);
      } catch (err) {
        setError('Failed to load accounts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [navigate]);

  return (
    <div className='bg-background text-on-background font-sans min-h-screen flex flex-col md:flex-row overflow-x-hidden'>
      <Sidebar />
      <div className='flex-1 flex flex-col min-h-screen md:ml-[280px]'>
        <Header />
        <main className='flex-1 mt-16 p-4 md:p-8 space-y-6 overflow-y-auto'>
          <div>
            <h2 className='font-headline-lg text-headline-lg text-on-background mb-2'>
              Welcome back, {user?.login_id || 'Customer'}
            </h2>
            <p className='font-body-md text-body-md text-on-surface-variant'>
              Here is an overview of your accounts and financial status.
            </p>
          </div>

          {loading ? (
            <div className='flex justify-center py-12'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
            </div>
          ) : error ? (
            <div className='bg-error-container border border-error text-on-error-container px-4 py-3 rounded-lg text-sm'>
              {error}
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  className='bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant flex flex-col hover:shadow-md transition-shadow cursor-pointer'
                  onClick={() => navigate(`/balance-inquiry?accountId=${acc.id}`)}
                >
                  <div className='flex justify-between items-start mb-4'>
                    <div className='p-2 bg-surface-container rounded-lg text-primary'>
                      <span className='material-symbols-outlined'>account_balance_wallet</span>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                        acc.status === 'ACTIVE'
                          ? 'bg-[#dcfce7] text-[#166534]'
                          : acc.status === 'FROZEN'
                          ? 'bg-error-container text-error'
                          : 'bg-[#fef9c3] text-[#854d0e]'
                      }`}
                    >
                      {acc.status}
                    </span>
                  </div>
                  <div className='mb-1'>
                    <span className='font-label-md text-label-md text-on-surface-variant uppercase tracking-wider'>
                      {acc.accountNumber.startsWith('**') ? acc.accountNumber : `Account - ${acc.accountNumber}`}
                    </span>
                  </div>
                  <div className='font-headline-md text-headline-md text-on-background mb-4'>
                    Click to view balance
                  </div>
                  <div className='mt-auto text-primary font-label-md text-label-md font-bold flex items-center gap-1 hover:underline'>
                    <span>Inquire Balance</span>
                    <span className='material-symbols-outlined text-[16px]'>arrow_forward</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
