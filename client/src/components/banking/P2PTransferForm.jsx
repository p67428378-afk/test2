import React, { useState } from 'react';
import SecureAuthModal from './SecureAuthModal';
import { transferService } from '../../services/api';

export default function P2PTransferForm({ accounts, onTransferSuccess, dailyLimitRemaining = 5000 }) {
  const [fromAccountId, setFromAccountId] = useState(accounts[0]?.id || '');
  const [recipientAccountNumber, setRecipientAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInitiate = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fromAccountId) {
      setError('Please select a source account.');
      return;
    }

    if (!recipientAccountNumber.trim()) {
      setError('Please enter a recipient account number.');
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

    if (parsedAmount > dailyLimitRemaining) {
      setError(`Daily P2P transfer limit exceeded. Remaining limit: $${dailyLimitRemaining.toFixed(2)}`);
      return;
    }

    // Open secure auth modal
    setIsAuthModalOpen(true);
  };

  const handleAuthConfirm = async (password) => {
    setIsAuthModalOpen(false);
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const result = await transferService.p2pTransfer(
        fromAccountId,
        recipientAccountNumber,
        parseFloat(amount),
        password,
        memo
      );
      setSuccess('P2P Transfer completed successfully!');
      setRecipientAccountNumber('');
      setAmount('');
      setMemo('');
      if (onTransferSuccess) {
        onTransferSuccess(result);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Transfer failed. Please check your password and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card p-lg rounded-2xl">
      <h2 className="font-title-lg text-title-lg text-on-surface mb-lg">Pay Someone Else (P2P)</h2>
      <form onSubmit={handleInitiate} className="flex flex-col gap-md">
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
          <label className="font-label-sm text-on-surface-variant mb-2 block">Recipient Account Number</label>
          <input
            value={recipientAccountNumber}
            onChange={(e) => setRecipientAccountNumber(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-md text-on-surface focus:border-primary focus:ring-0 focus:outline-none"
            placeholder="e.g. 111-222-333"
            type="text"
            required
          />
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
          <span className="text-xs text-on-surface-variant mt-1 block">
            Daily limit: $5,000.00 | Remaining: ${dailyLimitRemaining.toFixed(2)}
          </span>
        </div>

        <div>
          <label className="font-label-sm text-on-surface-variant mb-2 block">Memo (Optional)</label>
          <input
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-md text-on-surface focus:border-primary focus:ring-0 focus:outline-none"
            placeholder="e.g. Dinner split"
            type="text"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-on-primary font-label-lg py-lg rounded-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-md disabled:opacity-50"
        >
          <span className="material-symbols-outlined">lock</span>
          {loading ? 'Processing...' : 'Secure Transfer'}
        </button>
      </form>

      <SecureAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onConfirm={handleAuthConfirm}
      />
    </div>
  );
}
