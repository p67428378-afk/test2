
import React from 'react';

const AccountCard = ({ account }) => {
  const { account_type, balance, id } = account;
  const lastFourDigits = id.slice(-4);

  const getAccountIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'checking':
        return 'account_balance';
      case 'savings':
        return 'savings';
      case 'credit card':
        return 'credit_card';
      default:
        return 'credit_card';
    }
  };

  if (account_type === 'Credit Card') {
    return (
        <div className="col-span-12 md:col-span-4">
            <div className="bg-primary p-8 rounded-xl flex flex-col h-[280px] justify-between relative overflow-hidden transition-all duration-300 hover:translate-y-[-4px] shadow-[0px_24px_48px_rgba(0,45,114,0.15)] text-white">
                <div className="flex justify-between items-start z-10">
                    <div className="flex items-center space-x-2">
                        <div className="w-10 h-6 bg-yellow-400 rounded-sm opacity-80"></div>
                        <span className="font-label text-xs font-bold tracking-[0.2em] uppercase">Vault Infinite</span>
                    </div>
                    <span className="material-symbols-outlined text-white/50">contactless</span>
                </div>
                <div className="z-10">
                    <p className="font-label text-[10px] uppercase tracking-widest text-white/60 mb-2">Current Balance</p>
                    <p className="font-headline text-3xl font-bold">${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
                <div className="flex justify-between items-end z-10">
                    <div>
                        <p className="font-label text-[10px] uppercase tracking-widest text-white/60">Credit Limit</p>
                        <p className="font-body text-sm font-semibold">$250,000</p>
                    </div>
                    <span className="font-body text-lg font-bold tracking-[0.25em]">VISA</span>
                </div>
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            </div>
        </div>
    )
  }

  return (
    <div className='col-span-12 md:col-span-4 group'>
      <div className='bg-surface-container-lowest p-8 rounded-xl flex flex-col h-[280px] justify-between relative overflow-hidden transition-all duration-300 hover:translate-y-[-4px] shadow-[0px_12px_32px_rgba(0,0,0,0.04)]'>
        <div className='flex justify-between items-start z-10'>
          <div className='w-12 h-12 bg-surface-container-low rounded-xl flex items-center justify-center'>
            <span className='material-symbols-outlined text-primary'>{getAccountIcon(account_type)}</span>
          </div>
          <span className='font-label text-[10px] font-bold text-on-surface-variant uppercase tracking-widest'>{account_type} ·· {lastFourDigits}</span>
        </div>
        <div className='z-10'>
          <h3 className='font-headline text-lg font-bold text-on-surface'>
            {account_type === 'Checking' ? 'Private Checking' : 'Legacy High-Yield'}
          </h3>
          <p className='font-headline text-3xl font-bold mt-1'>${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className='flex items-center text-primary-fixed-variant font-label text-xs font-semibold z-10'>
            {account_type === 'Checking' ? 
                <><span className='material-symbols-outlined text-sm mr-1'>check_circle</span> Verified & Protected</> : 
                <><span className='material-symbols-outlined text-sm mr-1'>trending_up</span> 4.85% APY Active</>
            }
        </div>
        <div className='absolute -right-4 -bottom-4 w-32 h-32 bg-primary-fixed/10 rounded-full blur-3xl group-hover:bg-primary-fixed/20 transition-colors'></div>
      </div>
    </div>
  );
};

export default AccountCard;
