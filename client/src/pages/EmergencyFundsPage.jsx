import React, { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout.jsx';
import AllocationForm from '../components/emergency/AllocationForm.jsx';
import MFAModal from '../components/emergency/MFAModal.jsx';
import { allocateEmergencyFund, getEmergencyFundTransactions } from '../services/api';

export default function EmergencyFundsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form state to hold values during MFA verification
  const [pendingAllocation, setPendingAllocation] = useState(null);
  const [isMfaOpen, setIsMfaOpen] = useState(false);
  const [mfaLoading, setMfaLoading] = useState(false);

  const fetchTransactions = async () => {
    try {
      const data = await getEmergencyFundTransactions();
      setTransactions(data);
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      setError('Failed to load past emergency fund allocations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleFormSubmit = (allocationData) => {
    setPendingAllocation(allocationData);
    setIsMfaOpen(true);
  };

  const handleMfaConfirm = async (mfaCode) => {
    setMfaLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        ...pendingAllocation,
        mfa_code: mfaCode,
      };
      const result = await allocateEmergencyFund(payload);
      if (result.success) {
        setSuccess(`Successfully allocated $${pendingAllocation.amount.toLocaleString()} to ${pendingAllocation.project_name}.`);
        setIsMfaOpen(false);
        setPendingAllocation(null);
        // Refresh transactions list
        fetchTransactions();
      } else {
        throw new Error('Allocation failed');
      }
    } catch (err) {
      console.error('Failed to allocate emergency fund:', err);
      setError(err.response?.data?.detail || 'Failed to allocate emergency fund. Please verify your MFA code.');
    } finally {
      setMfaLoading(false);
    }
  };

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return '$0.00';
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${value.toLocaleString()}`;
  };

  return (
    <AppLayout title="Emergency Funds" subtitle="Authorize and allocate national emergency reserves">
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-gutter items-start'>
        {/* Left: Allocation Form */}
        <div className='lg:col-span-5'>
          <AllocationForm onSubmit={handleFormSubmit} />
        </div>

        {/* Right: Past Transactions */}
        <div className='lg:col-span-7 bg-surface-container border border-outline-variant rounded-lg overflow-hidden'>
          <div className='p-md border-b border-outline-variant bg-surface-container-high'>
            <h3 className='text-headline-md font-headline-md text-on-surface'>Past Emergency Fund Allocations</h3>
          </div>

          {success && (
            <div className='m-md bg-secondary/10 border border-secondary/20 text-secondary p-sm rounded text-body-md'>
              {success}
            </div>
          )}

          {error && !isMfaOpen && (
            <div className='m-md bg-error-container/20 border border-error/30 text-error p-sm rounded text-body-md'>
              {error}
            </div>
          )}

          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='bg-surface-container-highest'>
                  <th className='px-md py-sm text-label-md font-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant'>Project</th>
                  <th className='px-md py-sm text-label-md font-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant text-right'>Amount</th>
                  <th className='px-md py-sm text-label-md font-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant'>Authorized By</th>
                  <th className='px-md py-sm text-label-md font-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant'>Timestamp</th>
                </tr>
              </thead>
              <tbody className='text-body-md font-body-md divide-y divide-outline-variant'>
                {loading ? (
                  <tr>
                    <td colSpan={4} className='px-md py-lg text-center text-on-surface-variant'>
                      Loading transactions...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className='px-md py-lg text-center text-on-surface-variant'>
                      No emergency fund allocations recorded yet.
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx.id} className='hover:bg-surface-bright transition-colors'>
                      <td className='px-md py-sm text-on-surface font-medium'>{tx.project_name}</td>
                      <td className='px-md py-sm text-on-surface text-right font-mono'>{formatCurrency(tx.amount)}</td>
                      <td className='px-md py-sm text-on-surface-variant'>{tx.authorized_by}</td>
                      <td className='px-md py-sm text-on-surface-variant text-label-md'>
                        {new Date(tx.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <MFAModal
        isOpen={isMfaOpen}
        onClose={() => {
          setIsMfaOpen(false);
          setPendingAllocation(null);
        }}
        onConfirm={handleMfaConfirm}
        loading={mfaLoading}
      />
    </AppLayout>
  );
}
