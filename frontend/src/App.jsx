import React, { useState } from 'react';
import LoanForm from './components/LoanForm';
import Result from './components/Result';
import { checkEligibility } from './services/api';

function App() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleCheckEligibility = async (formData) => {
    try {
      const res = await checkEligibility(formData);
      setResult(res);
      setError(null);
    } catch (err) {
      setError(err);
      setResult(null);
    }
  };

  return (
    <div className='bg-surface text-on-surface min-h-screen flex flex-col'>
      <header className='bg-slate-50 dark:bg-[#0a2540] text-[#000f22] dark:text-[#b0c8eb] flex justify-between items-center px-6 py-4 w-full sticky top-0 z-50'>
        <div className='flex items-center gap-3'>
          <span className='material-symbols-outlined text-2xl'>account_balance</span>
          <h1 className='font-manrope font-bold text-lg tracking-tight'>Sovereign Ledger</h1>
        </div>
        <button className='w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-200/50 transition-colors'>
          <span className='material-symbols-outlined'>notifications</span>
        </button>
      </header>

      <main className='flex-grow px-5 py-8 space-y-8 max-w-md mx-auto w-full'>
        <section className='space-y-2'>
          <h2 className='text-3xl font-extrabold tracking-tight text-primary'>Loan Decision System</h2>
          <p className='text-on-surface-variant text-sm leading-relaxed'>Secure, institutional-grade credit assessment and automated underwriting.</p>
        </section>

        <LoanForm onCheckEligibility={handleCheckEligibility} />

        {result && <Result result={result} />}
        {error && <div className='text-red-500'>An error occurred.</div>}
      </main>

      <nav className='fixed bottom-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-2 bg-white/80 dark:bg-[#0a2540]/80 backdrop-blur-xl border-t border-[#c4c6ce]/20 shadow-[0px_-12px_32px_rgba(17,28,45,0.06)] rounded-t-xl'>
        <a className='flex flex-col items-center justify-center text-[#57657a] dark:text-slate-400 px-4 py-1 hover:opacity-80 transition-transform duration-200 scale-95' href='#'>
          <span className='material-symbols-outlined'>dashboard</span>
          <span className='font-inter text-[10px] font-semibold uppercase tracking-wider'>Dashboard</span>
        </a>
        <a className='flex flex-col items-center justify-center bg-[#d5e3fc] dark:bg-[#000f22] text-[#000f22] dark:text-[#ffffff] rounded-xl px-4 py-1 transition-transform duration-200 scale-95' href='#'>
          <span className='material-symbols-outlined' style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
          <span className='font-inter text-[10px] font-semibold uppercase tracking-wider'>Loans</span>
        </a>
        <a className='flex flex-col items-center justify-center text-[#57657a] dark:text-slate-400 px-4 py-1 hover:opacity-80 transition-transform duration-200 scale-95' href='#'>
          <span className='material-symbols-outlined'>trending_up</span>
          <span className='font-inter text-[10px] font-semibold uppercase tracking-wider'>Market</span>
        </a>
        <a className='flex flex-col items-center justify-center text-[#57657a] dark:text-slate-400 px-4 py-1 hover:opacity-80 transition-transform duration-200 scale-95' href='#'>
          <span className='material-symbols-outlined'>person</span>
          <span className='font-inter text-[10px] font-semibold uppercase tracking-wider'>Profile</span>
        </a>
      </nav>
    </div>
  );
}

export default App;
