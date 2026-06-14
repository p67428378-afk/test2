import React from 'react';

const BalanceCard = ({ balanceData }) => {
  if (!balanceData) return null;

  const {
    ledgerBalance,
    availableBalance,
    currency,
    remainingLimit,
    status,
    reasonCode,
  } = balanceData;

  const formatCurrency = (value) => {
    const symbol = currency === 'INR' ? '₹' : '$';
    return `${symbol}${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const holdAmount = ledgerBalance - availableBalance;
  const dailyLimit = 500000.00; // Assume 5 Lakhs daily limit
  const limitUsed = dailyLimit - remainingLimit;
  const limitUsedPercent = Math.min(100, Math.max(0, (limitUsed / dailyLimit) * 100));

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
      {/* Card 1: Ledger Balance */}
      <div className='bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant flex flex-col'>
        <div className='flex justify-between items-start mb-4'>
          <div className='p-2 bg-surface-container rounded-lg text-primary'>
            <span className='material-symbols-outlined'>account_balance_wallet</span>
          </div>
        </div>
        <div className='mb-1'>
          <span className='font-label-md text-label-md text-on-surface-variant uppercase tracking-wider'>Ledger Balance</span>
        </div>
        <div className='font-headline-lg text-headline-lg text-on-background mb-2'>
          {formatCurrency(ledgerBalance)}
        </div>
        <div className='font-body-md text-body-md text-on-surface-variant mt-auto'>
          Total book balance ({currency})
        </div>
      </div>

      {/* Card 2: Available Balance */}
      <div className='bg-surface-container-lowest rounded-xl p-6 shadow-sm border-2 border-secondary flex flex-col relative overflow-hidden'>
        <div className='absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-bl-full pointer-events-none'></div>
        <div className='flex justify-between items-start mb-4'>
          <div className='p-2 bg-secondary-container rounded-lg text-on-secondary-container'>
            <span className='material-symbols-outlined' style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <span className='text-xs font-semibold px-2 py-1 bg-secondary/10 text-secondary rounded-full'>Available</span>
        </div>
        <div className='mb-1'>
          <span className='font-label-md text-label-md text-on-surface-variant uppercase tracking-wider'>Available Balance</span>
        </div>
        <div className='font-headline-lg text-headline-lg text-on-background mb-2 text-primary'>
          {formatCurrency(availableBalance)}
        </div>
        <div className='font-body-md text-[13px] text-on-surface-variant mt-auto flex items-center gap-1'>
          {holdAmount > 0 ? (
            <>
              <span className='material-symbols-outlined text-[14px] text-error'>lock</span>
              Available after holds ({formatCurrency(holdAmount)} on hold)
            </>
          ) : (
            <>
              <span className='material-symbols-outlined text-[14px] text-[#22c55e]'>lock_open</span>
              No active holds on this account
            </>
          )}
        </div>
      </div>

      {/* Card 3: Daily Limit Usage */}
      <div className='bg-surface-container-lowest rounded-xl p-6 shadow-sm border border-outline-variant flex flex-col'>
        <div className='flex justify-between items-start mb-4'>
          <div className='p-2 bg-surface-container rounded-lg text-primary'>
            <span className='material-symbols-outlined'>speed</span>
          </div>
        </div>
        <div className='mb-1'>
          <span className='font-label-md text-label-md text-on-surface-variant uppercase tracking-wider'>Daily Limit Usage</span>
        </div>
        <div className='font-headline-lg text-headline-lg text-on-background mb-4'>
          {formatCurrency(remainingLimit)}
        </div>
        <div className='mt-auto'>
          <div className='flex justify-between font-label-md text-[11px] text-on-surface-variant mb-1'>
            <span>Limit Used</span>
            <span>{limitUsedPercent.toFixed(0)}%</span>
          </div>
          <div className='w-full bg-surface-variant rounded-full h-2 overflow-hidden'>
            <div className='bg-secondary h-full rounded-full' style={{ width: `${limitUsedPercent}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
