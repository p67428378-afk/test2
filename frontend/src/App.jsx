import React from 'react';
import PremiumCalculatorForm from './components/PremiumCalculatorForm';

function App() {
  return (
    <div className="bg-background font-body text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
      <header className="fixed top-0 w-full z-50 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm shadow-blue-900/5 no-border">
        <div className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto w-full font-['Inter'] tracking-tight">
          <span className="text-xl font-bold tracking-tighter text-slate-900 dark:text-slate-50">Precision Ledger</span>
          <nav className="hidden md:flex items-center space-x-8">
            <a className="text-blue-700 dark:text-blue-400 font-semibold border-b-2 border-blue-700 dark:border-blue-400 pb-1 active:opacity-80 transition-all duration-300" href="#">Estimator</a>
            <a className="text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-slate-100 active:opacity-80 transition-all duration-300" href="#">Policies</a>
            <a className="text-slate-500 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-slate-100 active:opacity-80 transition-all duration-300" href="#">Insights</a>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="material-symbols-outlined text-slate-500 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 p-2 rounded-full transition-colors">account_circle</button>
          </div>
        </div>
      </header>
      <main className="pt-32 pb-24 px-4 min-h-screen">
        <div className="max-w-[800px] mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tighter text-on-surface mb-4">
              Vehicle Insurance Premium Calculator
            </h1>
            <p className="text-on-surface-variant max-w-md mx-auto font-medium">
              Enter your vehicle and driver details to generate a precision-engineered quote based on real-time risk assessments.
            </p>
          </div>
          <PremiumCalculatorForm />
        </div>
      </main>
    </div>
  );
}

export default App;
