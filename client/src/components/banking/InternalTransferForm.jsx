import React, { useState } from 'react';
import { transferService } from '../../services/api';

export default function InternalTransferForm({ accounts, onTransferSuccess }) {
  const [fromAccountId, setFromAccountId] = useState(accounts[0]?.id || '');
  const [toAccountId, setToAccountId] = useState(accounts[1]?.id || '');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fromAccountId || !toAccountId) {
      setError('Please select both source and destination accounts.');
      return;
    }

    if (fromAccountId === toAccountId) {
      setError('Source and destination accounts must be different.');
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Please enter a valid transfer amount greater than zero.');
      return;
    }

    const sourceAccount = accounts.find(acc => acc.id === fromAccountId);
    if (sourceAccount && sourceAccount.balance < parsedAmount) {
      setError('Insufficient funds in the source account.');
      return;
    }

    setLoading(true);
    try {
      const result = await transferService.internalTransfer(fromAccountId, toAccountId, parsedAmount, memo);
      setSuccess('Transfer completed successfully!');
      setAmount('');
      setMemo('');
      if (onTransferSuccess) {
        onTransferSuccess(result);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Transfer failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-lg rounded-2xl">
      <h2 className="font-title-lg text-title-lg text-on-surface mb-lg">Transfer Between Own Accounts</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-md">
        {error && (
          <div className="p-md rounded-lg bg-error-container text-on-error-container text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="p-md rounded-lg bg-secondary-container/20 text-secondary text-sm">
            {success}
          </div>
        )}

        <div>
          <label className="font-label-sm text-on-surface-variant mb-2 block">From Account</label>
          <select
            value={fromAccountId}
            onChange={(e) => setFromAccountId(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-md text-on-surface focus:border-primary focus:ring-0 focus:outline-none"
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.account_type} ({acc.account_number}) - ${acc.balance.toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-label-sm text-on-surface-variant mb-2 block">To Account</label>
          <select
            value={toAccountId}
            onChange={(e) => setToAccountId(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-md text-on-surface focus:border-primary focus:ring-0 focus:outline-none"
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.account_type} ({acc.account_number}) - ${acc.balance.toFixed(2)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="font-label-sm text-on-surface-variant mb-2 block">Amount</label>
          <div className="relative">
            <span className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant">$</span>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-md pl-8 text-on-surface focus:border-primary focus:ring-0 focus:outline-none"
              placeholder="0.00"
              type="number"
              step="0.01"
              min="0.01"
              required
            />
          </div>
        </div>

        <div>
          <label className="font-label-sm text-on-surface-variant mb-2 block">Memo (Optional)</label>
          <input
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-md text-on-surface focus:border-primary focus:ring-0 focus:outline-none"
            placeholder="e.g. Savings deposit"
            type="text"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-on-primary font-label-lg py-lg rounded-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-md disabled:opacity-50"
        >
          <span className="material-symbols-outlined">send</span>
          {loading ? 'Processing...' : 'Transfer Now'}
        </button>
      </form>
    </div>
  );
}
