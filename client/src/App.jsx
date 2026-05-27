import React from 'react';
import AlertSetupPage from './pages/AlertSetupPage';

function App() {
  return (
    <div className="bg-surface">
      <header className="bg-surface-container-lowest dark:bg-inverse-surface shadow-sm dark:shadow-none border-b border-outline-variant docked full-width top-0 sticky z-50">
        <div className="flex justify-between items-center w-full px-container-padding-desktop max-w-7xl mx-auto h-20">
          <div className="flex items-center gap-8">
            <span className="text-headline-md font-headline-md text-primary dark:text-primary-fixed-dim">Zenith Bank</span>
            <nav className="hidden md:flex gap-6">
              <a className="text-on-surface-variant dark:text-outline-variant font-medium hover:text-primary dark:hover:text-primary-fixed-dim transition-colors duration-200 font-body-md text-body-md" href="#">Accounts</a>
              <a className="text-on-surface-variant dark:text-outline-variant font-medium hover:text-primary dark:hover:text-primary-fixed-dim transition-colors duration-200 font-body-md text-body-md" href="#">Transfers</a>
              <a className="text-on-surface-variant dark:text-outline-variant font-medium hover:text-primary dark:hover:text-primary-fixed-dim transition-colors duration-200 font-body-md text-body-md" href="#">Payments</a>
              <a className="text-on-surface-variant dark:text-outline-variant font-medium hover:text-primary dark:hover:text-primary-fixed-dim transition-colors duration-200 font-body-md text-body-md" href="#">Investments</a>
              <a className="text-on-surface-variant dark:text-outline-variant font-medium hover:text-primary dark:hover:text-primary-fixed-dim transition-colors duration-200 font-body-md text-body-md" href="#">Support</a>
            </nav>
          </div>
          <div className="flex items-center gap-stack-md">
            <button className="material-symbols-outlined text-on-surface-variant">search</button>
            <div className="h-10 w-10 rounded-full overflow-hidden border border-outline-variant bg-surface-container">
              <img alt="User Profile Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCb4rz8HM_rZTZQr8DBsuF4F-Bk5IkwXFAeeU0qWyYCN6686_s_xWCYS9ewdnTaYWMCE98BDziNqOxtzZanijrqP8BZFkO-6nTvrHwRV_0olFgr_eQBFoJEDKfvCc7JpioAc9q1yl2Pleial2U6CzVL-0jcegQbEYVXG1QBPdZUkXpKa40u9i_V82Ny6cwgwLgGNWHpJngMc5shriqGtFfnogNZoij-uOyvU1BwoN3s861OcYU5RFCg_tpjm35yMfnmEqfxZCquug0"/>
            </div>
            <span className="font-label-md text-label-md text-primary cursor-pointer hover:opacity-80 transition-opacity">Log Out</span>
          </div>
        </div>
      </header>
      <AlertSetupPage />
      <footer className="bg-surface-container-low dark:bg-inverse-surface border-t border-outline-variant full-width bottom-0">
        <div className="w-full py-stack-lg px-container-padding-desktop flex flex-col md:flex-row justify-between items-center gap-stack-md max-w-7xl mx-auto">
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="font-headline-md text-on-surface dark:text-surface-bright">Zenith Bank</span>
            <p className="text-on-surface-variant dark:text-outline-variant font-label-md text-label-md">
              © 2024 Zenith Financial Group. Member FDIC. Equal Housing Lender.
            </p>
          </div>
          <div className="flex gap-6">
            <a className="text-on-surface-variant dark:text-outline-variant font-label-md text-label-md hover:text-primary dark:hover:text-primary-fixed-dim underline transition-all" href="#">Privacy Policy</a>
            <a className="text-on-surface-variant dark:text-outline-variant font-label-md text-label-md hover:text-primary dark:hover:text-primary-fixed-dim underline transition-all" href="#">Terms of Service</a>
            <a className="text-on-surface-variant dark:text-outline-variant font-label-md text-label-md hover:text-primary dark:hover:text-primary-fixed-dim underline transition-all" href="#">Security Center</a>
            <a className="text-on-surface-variant dark:text-outline-variant font-label-md text-label-md hover:text-primary dark:hover:text-primary-fixed-dim underline transition-all" href="#">Contact Us</a>
            <a className="text-on-surface-variant dark:text-outline-variant font-label-md text-label-md hover:text-primary dark:hover:text-primary-fixed-dim underline transition-all" href="#">Accessibility</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
