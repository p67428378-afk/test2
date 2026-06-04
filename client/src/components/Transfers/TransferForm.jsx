import React, { useState, useEffect } from 'react';
import { getAccounts, createTransfer } from '../../services/api';
import { ArrowRight } from 'lucide-react';

const TransferForm = () => {
  const [accounts, setAccounts] = useState([]);
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await getAccounts();
        setAccounts(response.data);
        if (response.data.length > 0) {
          setFromAccount(response.data[0].account_id);
        }
        if (response.data.length > 1) {
          setToAccount(response.data[1].account_id);
        }
      } catch (err) {
        setError('Could not load accounts.');
      }
    };
    fetchAccounts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!fromAccount || !toAccount || !amount) {
      setError('Please fill all fields.');
      setLoading(false);
      return;
    }
    if (fromAccount === toAccount) {
      setError('Cannot transfer to the same account.');
      setLoading(false);
      return;
    }

    try {
      const transferData = {
        from_account_id: fromAccount,
        to_account_id: toAccount,
        amount: parseFloat(amount)
      };
      const response = await createTransfer(transferData);
      setSuccess(`Transfer successful! Transfer ID: ${response.data.transfer_id}`);
      setAmount(''); // Reset amount
    } catch (err) {
      setError(err.response?.data?.detail || 'Transfer failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-lg shadow-sm p-8">
      <h3 className="text-xl font-semibold text-on-surface mb-6">New Transfer</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* From Account */}
          <div className="flex flex-col">
            <label htmlFor="fromAccount" className="text-sm font-medium text-on-surface-variant mb-2">From</label>
            <select 
              id="fromAccount" 
              value={fromAccount}
              onChange={(e) => setFromAccount(e.target.value)}
              className="h-12 px-4 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:outline-none"
            >
              {accounts.map(acc => (
                <option key={acc.account_id} value={acc.account_id}>
                  {acc.account_type.replace('_', ' ')} ({acc.account_number.slice(-4)})
                </option>
              ))}
            </select>
          </div>

          {/* Icon */}
          <div className="text-center mt-6 md:mt-0">
            <ArrowRight size={24} className="text-primary mx-auto"/>
          </div>

          {/* To Account */}
          <div className="flex flex-col">
            <label htmlFor="toAccount" className="text-sm font-medium text-on-surface-variant mb-2">To</label>
            <select 
              id="toAccount" 
              value={toAccount}
              onChange={(e) => setToAccount(e.target.value)}
              className="h-12 px-4 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:outline-none"
            >
              {accounts.map(acc => (
                <option key={acc.account_id} value={acc.account_id}>
                  {acc.account_type.replace('_', ' ')} ({acc.account_number.slice(-4)})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Amount */}
        <div className="flex flex-col">
          <label htmlFor="amount" className="text-sm font-medium text-on-surface-variant mb-2">Amount</label>
          <input 
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="h-12 px-4 rounded-lg border border-outline-variant bg-surface-bright focus:border-primary focus:outline-none"
            step="0.01"
            min="0.01"
            required
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 bg-primary-container text-on-primary font-semibold rounded-lg shadow-sm hover:shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            {loading ? 'Processing...' : 'Confirm Transfer'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransferForm;
