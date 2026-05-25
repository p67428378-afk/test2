
import React from 'react';

const StatementPreview = ({ statement, onDownload }) => {
  return (
    <div className="bg-background text-on-surface antialiased pb-32">
      <main className="max-w-4xl mx-auto px-6 mt-8">
        <div className="mb-10">
          <p className="font-label text-on-surface-variant text-[11px] uppercase tracking-widest mb-1">Statement for {statement.account_number}</p>
          <h2 className="font-headline font-extrabold text-4xl text-primary tracking-tight">{new Date(statement.start_date).toLocaleString('default', { month: 'long' })} {new Date(statement.start_date).getFullYear()}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="md:col-span-2 bg-surface-container-lowest p-8 rounded-xl shadow-[0_32px_64px_rgba(25,28,30,0.04)] relative overflow-hidden">
            <div className="relative z-10">
              <p className="font-label text-on-surface-variant text-sm mb-2">Closing Balance</p>
              <h3 className="font-headline font-bold text-5xl text-primary tracking-tighter">€{statement.closing_balance.toLocaleString()}</h3>
              <div className="mt-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-on-primary-fixed-variant" style={{fontVariationSettings: "'FILL' 1"}}>trending_up</span>
                <p className="text-on-primary-fixed-variant font-semibold text-sm">+€{(statement.closing_balance - statement.opening_balance).toLocaleString()} this month</p>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-full opacity-10 pointer-events-none">
              <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0 100 C 20 80, 50 80, 100 0 L 100 100 Z" fill="#002d72"></path>
              </svg>
            </div>
          </div>
          <div className="bg-surface-container-low p-8 rounded-xl flex flex-col justify-between">
            <div>
              <p className="font-label text-on-surface-variant text-sm mb-1">Opening Balance</p>
              <h4 className="font-headline font-bold text-2xl text-on-surface tracking-tight">€{statement.opening_balance.toLocaleString()}</h4>
            </div>
          </div>
        </div>
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline font-bold text-xl text-primary">Transaction History</h3>
            <span className="font-label text-xs text-on-surface-variant">{statement.start_date} to {statement.end_date}</span>
          </div>
          <div className="flex flex-col">
            {statement.transactions.map((t, i) => (
              <div key={i} className={`flex items-center justify-between py-5 px-4 ${i % 2 === 0 ? 'bg-surface-container-low' : 'bg-surface'} rounded-xl mb-4 transition-all hover:bg-surface-container-high cursor-pointer`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-surface-container-lowest flex items-center justify-center shadow-sm">
                    <span className="material-symbols-outlined text-primary">{t.type === 'credit' ? 'payments' : 'shopping_bag'}</span>
                  </div>
                  <div>
                    <p className="font-headline font-bold text-on-surface">{t.description}</p>
                    <div className="flex gap-3 items-center mt-0.5">
                      <span className="text-[11px] text-on-surface-variant font-medium">{new Date(t.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-headline font-bold text-lg ${t.type === 'credit' ? 'text-on-primary-fixed-variant' : 'text-on-tertiary-fixed-variant'}`}>{t.type === 'credit' ? '+' : '-'}€{t.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <div className="flex flex-col items-center justify-center pt-8 pb-12">
          <button onClick={onDownload} className="w-full md:w-auto px-12 py-4 bg-gradient-to-b from-[#001a48] to-[#002d72] text-white rounded-xl font-body font-bold text-sm flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-[0_16px_32px_rgba(0,45,114,0.15)] hover:brightness-110">
            <span className="material-symbols-outlined">download</span>
            Download Options
          </button>
        </div>
      </main>
    </div>
  );
};

export default StatementPreview;
