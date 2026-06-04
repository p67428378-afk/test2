import React, { useState } from 'react';
import PremiumForm from '../components/PremiumForm';
import PremiumResult from '../components/PremiumResult';

const PremiumCalculatorPage = () => {
  const [premiumResult, setPremiumResult] = useState(320.00); // Initial example value

  return (
    <body className="bg-background text-on-background min-h-screen flex flex-col grid-bg">
      <header className="bg-surface dark:bg-surface-dim shadow-md fixed top-0 full-width z-50 w-full">
        <div className="flex justify-between items-center px-gutter py-md w-full max-w-container-max mx-auto">
          <div className="flex items-center gap-2">
            <span className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim">InsureDrive</span>
          </div>
          <nav className="hidden md:flex items-center gap-xl">
            <a className="text-primary dark:text-primary-fixed-dim border-b-2 border-primary py-1 font-label-md text-label-md" href="#">Calculator</a>
            <a className="text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors px-3 py-1 rounded-lg font-label-md text-label-md" href="#">History</a>
            <a className="text-on-surface-variant dark:text-on-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors px-3 py-1 rounded-lg font-label-md text-label-md" href="#">Support</a>
          </nav>
          <div className="flex items-center gap-md">
            <button className="material-symbols-outlined text-primary hover:bg-surface-container-high p-2 rounded-full transition-colors active:scale-95">account_circle</button>
          </div>
        </div>
      </header>

      <main className="flex-grow pt-32 pb-24 px-gutter flex flex-col items-center">
        <div className="w-full max-w-[800px]">
          <div className="mb-xl text-center md:text-left">
            <h1 className="font-display-lg text-display-lg text-[#1F2937] tracking-tight mb-base">Vehicle Insurance Premium Calculator</h1>
            <p className="font-body-base text-body-base text-on-surface-variant max-w-[600px]">Get an instant, transparent quote for your vehicle insurance. Adjust the parameters below to see how your premium changes in real-time.</p>
          </div>

          <div className="w-full h-1 bg-outline-variant rounded-full mb-xl overflow-hidden">
            <div className="h-full w-2/3 bg-primary transition-all duration-700 ease-out"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-xl">
            <PremiumForm setPremiumResult={setPremiumResult} />
            
            <aside className="md:col-span-4 flex flex-col gap-lg">
              <PremiumResult premium={premiumResult} />
              
              <div className="bg-surface-container-low rounded-lg p-md border border-outline-variant">
                <h3 className="font-label-md text-label-md text-primary mb-sm">Why this rate?</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Your premium is calculated based on the base vehicle value adjusted for safe-driving bonuses and vehicle-specific risk factors.</p>
                <div className="mt-md space-y-2">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span className="text-xs">Comprehensive Coverage</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span className="text-xs">Third-Party Liability</span>
                  </div>
                </div>
              </div>

              <div className="relative h-32 rounded-lg overflow-hidden group shadow-md">
                <img alt="Professional Car Insurance Illustration" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEO6nos8YzR3dC9j1EXKQqCgCpFCrEQ06eF-jC-3v3DKePFk0VTOebieyO3yWK2bvrmuKaHUMuUoZ_GWpv-GHvSwYtOpt5t8yhCCODOGkjySoh2GPqWE9_yeM98LXkk5v-Prqsm41CwsAraXaSQdc1GkVcC7Ku_iv7myI_4vlNLIaoOLfpnIJYCZ8OGFOQnQ2p5tKRLsiZD0Y06_BkQO51Uc8u6d6C8dOInq5sFvmjCxYtG7rnNXhVdDS2lltszzpaHjmUCiQTSAg"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-md">
                  <span className="text-white text-xs font-medium">Drive with Confidence</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <nav className="fixed bottom-0 w-full z-50 flex justify-around items-center px-4 py-2 md:hidden bg-surface dark:bg-surface-dim border-t border-outline-variant shadow-md">
        <div className="flex flex-col items-center justify-center bg-secondary-container dark:bg-secondary-container text-on-secondary-container rounded-full px-4 py-1">
          <span className="material-symbols-outlined">calculate</span>
          <span className="font-label-md text-label-md">Calculator</span>
        </div>
        <div className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant">
          <span className="material-symbols-outlined">history</span>
          <span className="font-label-md text-label-md">History</span>
        </div>
        <div className="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant">
          <span className="material-symbols-outlined">contact_support</span>
          <span className="font-label-md text-label-md">Support</span>
        </div>
      </nav>

      <footer className="hidden md:flex flex-col items-center py-xl w-full bg-surface-container-low dark:bg-surface-container-lowest border-t border-outline-variant">
        <div className="max-w-container-max w-full px-gutter flex flex-col md:flex-row justify-between items-center gap-md">
          <div className="flex flex-col gap-1">
            <span className="font-label-caps text-label-caps font-bold text-on-surface uppercase">InsureDrive Analytics</span>
            <p className="font-body-sm text-body-sm text-on-surface-variant">© 2024 InsureDrive Analytics. All rights reserved.</p>
          </div>
          <div className="flex gap-lg">
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Privacy Policy</a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Terms of Service</a>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="#">Contact Us</a>
          </div>
        </div>
      </footer>
    </body>
  );
};

export default PremiumCalculatorPage;
