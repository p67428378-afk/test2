import React from 'react';
import DebitCardSpendAlertSetupPage from './pages/DebitCardSpendAlertSetupPage';

function App() {
  return (
    <div className="bg-background min-h-screen flex flex-col">
      <header className="bg-surface dark:bg-surface-container-low shadow-sm w-full h-16 sticky top-0 z-50">
        <div className="flex justify-between items-center w-full px-margin-desktop max-w-[1200px] mx-auto h-full">
          <div className="text-title-lg font-title-lg font-bold text-primary dark:text-primary-fixed-dim">SecurePay Alerts</div>
          <div className="flex items-center gap-md">
            <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim cursor-pointer p-base rounded-full hover:bg-surface-container-low transition-colors duration-200">lock</span>
            <span className="material-symbols-outlined text-primary dark:text-primary-fixed-dim cursor-pointer p-base rounded-full hover:bg-surface-container-low transition-colors duration-200">account_circle</span>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-md">
        <DebitCardSpendAlertSetupPage />
      </main>

      <footer className="bg-surface-container-low dark:bg-surface-dim border-t border-outline-variant dark:border-outline mt-auto">
        <div className="w-full py-md px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-sm max-w-[1200px] mx-auto">
          <div className="text-label-sm font-label-sm text-on-surface-variant">© 2024 SecurePay Financial. All rights reserved. Secured by 256-bit encryption.</div>
          <div className="flex gap-md">
            <a href="#" className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary transition-colors duration-200">Security Policy</a>
            <a href="#" className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary transition-colors duration-200">Terms of Service</a>
            <a href="#" className="text-label-sm font-label-sm text-on-surface-variant hover:text-primary transition-colors duration-200">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
