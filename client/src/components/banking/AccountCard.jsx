import React from 'react';

export default function AccountCard({ account }) {
  const isChecking = account.account_type?.toLowerCase() === 'checking';
  const trend = isChecking ? '+2.4% trend' : '+0.5% trend';
  const icon = isChecking ? 'account_balance' : 'savings';
  const bgGradient = isChecking 
    ? 'bg-primary/10 group-hover:bg-primary/20' 
    : 'bg-secondary/10 group-hover:bg-secondary/20';
  const iconColor = isChecking ? 'text-primary' : 'text-secondary';

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  return (
    <div className="glass-card p-lg rounded-2xl relative overflow-hidden group transition-all duration-300 hover:scale-[1.02]">
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl transition-all duration-500 ${bgGradient}`}></div>
      <div className="flex justify-between items-start mb-lg">
        <div className="flex flex-col">
          <span className="font-label-lg text-label-lg text-on-surface-variant capitalize">
            {account.account_type || 'Account'}
          </span>
          <span className="font-label-sm text-label-sm text-outline">
            {account.account_number || '000-000-000'}
          </span>
        </div>
        <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
      </div>
      <div className="mb-md">
        <span className="font-display-lg text-display-lg text-on-surface">
          {formatCurrency(account.balance || 0)}
        </span>
      </div>
      <div className="flex items-center gap-xs">
        <span className="material-symbols-outlined text-secondary text-sm">trending_up</span>
        <span className="text-secondary font-label-md text-label-md">{trend}</span>
      </div>
    </div>
  );
}
