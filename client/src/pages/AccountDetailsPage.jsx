import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import AccountSelector from '../components/accounts/AccountSelector';
import BalanceCard from '../components/accounts/BalanceCard';
import TransactionTable from '../components/accounts/TransactionTable';
import AuditLogTable from '../components/accounts/AuditLogTable';
import { accountService, auditService, authService } from '../services/api';

const AccountDetailsPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [balanceData, setBalanceData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    const fetchInitialData = async () => {
      try {
        const accs = await accountService.getAccounts();
        setAccounts(accs);

        if (accs.length > 0) {
          // Check if accountId is in query params
          const queryId = searchParams.get('accountId');
          const initialId = queryId && accs.some(a => a.id === queryId) ? queryId : accs[0].id;
          setSelectedAccountId(initialId);
        } else {
          setError('No accounts found for this user.');
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to load accounts. Please try again later.');
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [navigate, searchParams]);

  useEffect(() => {
    if (!selectedAccountId) return;

    const fetchAccountDetails = async () => {
      setLoading(true);
      setError('');
      try {
        // Fetch balance
        const bal = await accountService.getBalance(selectedAccountId);
        setBalanceData(bal);

        // Fetch transactions
        const txs = await accountService.getTransactions(selectedAccountId);
        setTransactions(txs);

        // Fetch audit logs
        const logs = await auditService.getAuditLogs();
        setAuditLogs(logs);
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load account details.');
      } finally {
        setLoading(false);
      }
    };

    fetchAccountDetails();
  }, [selectedAccountId]);

  const handleAccountChange = (id) => {
    setSelectedAccountId(id);
    setSearchParams({ accountId: id });
  };

  return (
    <div className='bg-background text-on-background font-sans min-h-screen flex flex-col md:flex-row overflow-x-hidden'>
      <Sidebar />
      <div className='flex-1 flex flex-col min-h-screen md:ml-[280px]'>
        <Header />
        <main className='flex-1 mt-16 p-4 md:p-8 space-y-6 overflow-y-auto'>
          {error && (
            <div className='bg-error-container border border-error text-on-error-container px-4 py-3 rounded-lg text-sm flex items-start gap-2'>
              <span className='material-symbols-outlined text-[18px] mt-0.5'>error</span>
              <span>{error}</span>
            </div>
          )}

          {accounts.length > 0 && (
            <AccountSelector
              accounts={accounts}
              selectedAccountId={selectedAccountId}
              onChange={handleAccountChange}
              status={balanceData?.status || 'ACTIVE'}
            />
          )}

          {/* Restricted Status Banners */}
          {balanceData?.status === 'DORMANT' && (
            <div className='bg-[#fef9c3] border border-[#fef08a] text-[#854d0e] p-4 rounded-xl flex items-start gap-3 shadow-sm'>
              <span className='material-symbols-outlined text-[#ca8a04]'>warning</span>
              <div>
                <h4 className='font-bold text-sm'>RESTRICTED: Account is dormant (Reason: ACC_DORMANT)</h4>
                <p className='text-xs mt-1'>Please complete KYC verification or contact your branch manager to reactivate this account.</p>
              </div>
            </div>
          )}

          {balanceData?.status === 'FROZEN' && (
            <div className='bg-error-container border border-[#fecaca] text-on-error-container p-4 rounded-xl flex items-start gap-3 shadow-sm'>
              <span className='material-symbols-outlined text-error'>block</span>
              <div>
                <h4 className='font-bold text-sm'>RESTRICTED: Account is frozen (Reason: ACC_FROZEN)</h4>
                <p className='text-xs mt-1'>Debit and credit operations are blocked on this account. Please contact customer support immediately.</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className='flex justify-center py-12'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
            </div>
          ) : (
            <>
              <BalanceCard balanceData={balanceData} />

              <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8'>
                <div className='lg:col-span-7'>
                  <TransactionTable transactions={transactions} currency={balanceData?.currency || 'INR'} />
                </div>
                <div className='lg:col-span-5'>
                  <AuditLogTable logs={auditLogs} />
                </div>
              </div>
            </>
          )}

          {/* Edge Case Previews (For Testing) */}
          <div className='mt-8 pt-8 border-t border-outline-variant'>
            <h3 className='font-headline-sm text-headline-sm text-on-surface-variant mb-4'>Edge Case Previews (For Testing)</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 opacity-80 hover:opacity-100 transition-opacity'>
              {/* Dormant Card */}
              <div className='bg-surface-container-lowest border border-[#fef08a] rounded-xl overflow-hidden shadow-sm'>
                <div className='bg-[#fef9c3] p-3 border-b border-[#fef08a] flex items-start gap-2'>
                  <span className='material-symbols-outlined text-[#ca8a04] text-[18px] mt-0.5'>warning</span>
                  <p className='font-body-md text-[12px] text-[#854d0e]'>
                    <strong>RESTRICTED:</strong> Account is dormant (Reason: ACC_DORMANT). Please complete KYC to reactivate.
                  </p>
                </div>
                <div className='p-4 flex justify-between items-center bg-surface-bright'>
                  <div>
                    <h4 className='font-headline-sm text-[14px] text-on-background'>Savings Account - ********1234</h4>
                    <span className='font-label-md text-[10px] text-outline uppercase'>Ledger: ₹45,200.00</span>
                  </div>
                  <div className='px-2 py-1 rounded bg-[#fef08a] text-[#854d0e] font-label-md text-[10px] border border-[#fde047]'>
                    DORMANT
                  </div>
                </div>
              </div>

              {/* Frozen Card */}
              <div className='bg-surface-container-lowest border border-error-container rounded-xl overflow-hidden shadow-sm'>
                <div className='bg-error-container p-3 border-b border-[#fecaca] flex items-start gap-2'>
                  <span className='material-symbols-outlined text-error text-[18px] mt-0.5'>block</span>
                  <p className='font-body-md text-[12px] text-on-error-container'>
                    <strong>RESTRICTED:</strong> Account is frozen (Reason: ACC_FROZEN). Debit/Credit operations blocked. Contact support.
                  </p>
                </div>
                <div className='p-4 flex justify-between items-center bg-surface-bright'>
                  <div>
                    <h4 className='font-headline-sm text-[14px] text-on-background'>Checking Account - ********9012</h4>
                    <span className='font-label-md text-[10px] text-outline uppercase'>Ledger: ₹0.00</span>
                  </div>
                  <div className='px-2 py-1 rounded bg-error text-on-error font-label-md text-[10px]'>
                    FROZEN
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountDetailsPage;
