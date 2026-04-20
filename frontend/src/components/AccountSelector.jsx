import React from 'react';

const AccountSelector = ({ accountNumber, setAccountNumber }) => {
  return (
    <div className="bg-surface-container-low rounded-xl p-6 transition-all">
        <label className="block font-label text-sm font-semibold uppercase tracking-widest text-on-surface-variant mb-4">Select Account
            <div className="grid grid-cols-1 gap-4">
                <button className="w-full text-left bg-surface-container-lowest p-5 rounded-xl flex items-center justify-between group transition-all active:scale-[0.98]">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-primary-container flex items-center justify-center">
                            <span className="material-symbols-outlined text-white" style={{fontVariationSettings: "'FILL' 1"}}>account_balance_wallet</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-primary tracking-tight">Private Wealth Savings</h3>
                            <p className="text-sm text-on-surface-variant">•••• 8829</p>
                        </div>
                    </div>
                    <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">chevron_right</span>
                </button>
                <button className="w-full text-left bg-surface-container-high/50 p-5 rounded-xl flex items-center justify-between group transition-all opacity-70 hover:opacity-100">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-surface-container-highest flex items-center justify-center">
                            <span className="material-symbols-outlined text-secondary">payments</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-on-surface-variant tracking-tight">Investment Portfolio</h3>
                            <p className="text-sm text-on-surface-variant">•••• 4120</p>
                        </div>
                    </div>
                    <span className="material-symbols-outlined text-on-surface-variant">unfold_more</span>
                </button>
            </div>
        </label>
    </div>
  );
};

export default AccountSelector;
