import React from 'react';

const StatementPreview = ({ statement, onDownload }) => {
  return (
    <div className="bg-surface text-on-surface min-h-screen pb-32">
      <header className="flex justify-between items-center w-full px-6 h-16 sticky top-0 z-50 bg-[#f7f9fb]/90 dark:bg-[#191c1e]/90 backdrop-blur-md no-border shadow-[0_1px_0_0_rgba(196,206,210,0.1)]">
        <div className="flex items-center gap-4">
          <button className="transition-all duration-300 ease-in-out active:scale-95 text-[#002D72] dark:text-[#3d5ca2]">
            <span className="material-symbols-outlined" data-icon="arrow_back">arrow_back</span>
          </button>
          <h1 className="font-['Manrope'] font-bold text-lg tracking-tight text-[#002D72] dark:text-[#3d5ca2]">Statements</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="transition-all duration-300 ease-in-out active:scale-95 text-[#44474e] dark:text-[#c4c6d2]">
            <span className="material-symbols-outlined" data-icon="lock">lock</span>
          </button>
        </div>
      </header>
      <main className="max-w-screen-md mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-surface-container-low p-6 rounded-xl relative overflow-hidden">
            <div className="flex flex-col gap-1">
              <span className="font-label text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">Opening Balance</span>
              <span className="editorial-text text-3xl font-extrabold tracking-tighter text-primary">€{statement.opening_balance.toLocaleString()}</span>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <span className="material-symbols-outlined text-8xl" data-icon="account_balance">account_balance</span>
            </div>
          </div>
          <div className="bg-primary-container p-6 rounded-xl relative overflow-hidden">
            <div className="flex flex-col gap-1">
              <span className="font-label text-[10px] font-semibold uppercase tracking-widest text-on-primary-container">Closing Balance</span>
              <span className="editorial-text text-3xl font-extrabold tracking-tighter text-white">€{statement.closing_balance.toLocaleString()}</span>
            </div>
            <div className="absolute -right-4 -bottom-4 opacity-10 text-white">
              <span className="material-symbols-outlined text-8xl" data-icon="trending_up">trending_up</span>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-lowest p-4 rounded-xl mb-8 flex items-center justify-between shadow-[0_8px_32px_rgba(25,28,30,0.04)]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-surface-container rounded-lg">
              <span className="material-symbols-outlined text-primary" data-icon="calendar_today">calendar_today</span>
            </div>
            <div>
              <p className="font-label text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Statement Period</p>
              <p className="font-body font-bold text-on-surface">{statement.start_date} — {statement.end_date}</p>
            </div>
          </div>
          <button className="text-surface-tint font-semibold text-sm hover:underline transition-all">Change</button>
        </div>
        <div className="flex items-center justify-between mb-4 px-1">
          <h2 className="editorial-text text-xl font-bold text-primary">Transaction History</h2>
          <span className="font-label text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">{statement.transactions.length} Items</span>
        </div>
        <div className="bg-surface-container-low rounded-2xl overflow-hidden shadow-sm">
          <div className="flex flex-col divide-y divide-outline-variant/10">
            {statement.transactions.map((t, i) => (
              <div key={i} className={`flex items-center justify-between p-5 ${i % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface-container-low/30'} hover:bg-surface-container transition-colors group`}>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center ${t.type === 'credit' ? 'text-primary-container' : 'text-on-tertiary-container'}`}>
                    <span className="material-symbols-outlined" data-icon={t.type === 'credit' ? 'payments' : 'shopping_bag'}>{t.type === 'credit' ? 'payments' : 'shopping_bag'}</span>
                  </div>
                  <div>
                    <p className="font-body font-bold text-on-surface group-hover:text-primary transition-colors">{t.description}</p>
                    <p className="font-body text-xs text-on-surface-variant">{t.date} • {t.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-headline font-bold ${t.type === 'credit' ? 'text-on-primary-fixed-variant' : 'text-on-tertiary-fixed-variant'}`}>{t.type === 'credit' ? '+' : '-'}€{t.amount.toLocaleString()}</p>
                  {t.type === 'credit' && <span className="font-label text-[10px] font-bold text-on-primary-container px-2 py-0.5 bg-secondary-container rounded uppercase">Settled</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 mb-20 text-center">
          <button onClick={onDownload} className="w-full bg-gradient-to-r from-primary to-primary-container text-white py-4 rounded-xl font-headline font-bold flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all">
            <span className="material-symbols-outlined" data-icon="download">download</span>
            Download Options
          </button>
          <p className="mt-4 font-body text-xs text-on-surface-variant max-w-xs mx-auto">
            PDF, CSV, and OFX formats available. Electronic statements are legally binding documents.
          </p>
        </div>
      </main>
    </div>
  );
};

export default StatementPreview;
