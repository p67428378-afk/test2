import React from 'react';
import CalculatorPage from './pages/CalculatorPage';

function App() {
  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <header className="bg-surface dark:bg-inverse-surface border-b border-outline-variant dark:border-outline docked full-width top-0 z-50">
        <div className="flex justify-between items-center w-full px-margin-mobile md:px-gutter max-w-container-max-width mx-auto h-16">
          <div className="text-headline-md font-headline-md font-bold text-primary dark:text-inverse-primary">SureDrive Insurance</div>
          <nav className="hidden md:flex gap-6 items-center">
            <a className="text-primary dark:text-inverse-primary border-b-2 border-primary dark:border-inverse-primary pb-1 font-bold text-label-sm font-label-sm hover:text-primary transition-colors" href="#">Calculator</a>
            <a className="text-on-surface-variant dark:text-surface-variant text-label-sm font-label-sm hover:text-primary transition-colors" href="#">Coverage</a>
            <a className="text-on-surface-variant dark:text-surface-variant text-label-sm font-label-sm hover:text-primary transition-colors" href="#">Claims</a>
            <a className="text-on-surface-variant dark:text-surface-variant text-label-sm font-label-sm hover:text-primary transition-colors" href="#">Support</a>
          </nav>
          <button className="bg-primary text-on-primary px-4 py-2 rounded font-bold text-label-sm hover:opacity-90 active:scale-95 transition-all">Sign In</button>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center py-12 px-margin-mobile">
        <CalculatorPage />
      </main>

      <footer className="bg-surface-container-low dark:bg-inverse-surface border-t border-outline-variant dark:border-outline">
        <div className="w-full py-8 px-margin-mobile flex flex-col md:flex-row justify-between items-center max-w-container-max-width mx-auto gap-4">
          <div className="text-label-sm font-label-sm font-bold text-on-surface dark:text-inverse-on-surface">SureDrive Insurance</div>
          <p className="text-caption font-caption text-on-surface-variant dark:text-surface-variant">© 2024 SureDrive Insurance. A high-trust financial tool.</p>
          <div className="flex gap-4">
            <a className="text-caption font-caption text-on-surface-variant hover:text-primary underline transition-all" href="#">Privacy Policy</a>
            <a className="text-caption font-caption text-on-surface-variant hover:text-primary underline transition-all" href="#">Terms of Service</a>
          </div>
        </div>
      </footer>

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center h-16 md:hidden bg-surface dark:bg-inverse-surface border-t border-outline-variant dark:border-outline shadow-lg">
        <button className="flex flex-col items-center justify-center text-primary dark:text-inverse-primary font-bold scale-95 transition-transform duration-200">
          <span className="material-symbols-outlined">calculate</span>
          <span className="text-label-sm font-label-sm">Estimate</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant dark:text-surface-variant hover:bg-surface-container transition-all">
          <span className="material-symbols-outlined">verified_user</span>
          <span className="text-label-sm font-label-sm">Policy</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant dark:text-surface-variant hover:bg-surface-container transition-all">
          <span className="material-symbols-outlined">person</span>
          <span className="text-label-sm font-label-sm">Profile</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
