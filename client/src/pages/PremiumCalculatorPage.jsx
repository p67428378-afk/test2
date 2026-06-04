import React from 'react';
import Header from '../components/Header';
import PremiumForm from '../components/PremiumForm';

const PremiumCalculatorPage = () => {
  return (
    <div className='bg-background text-on-background min-h-screen flex flex-col'>
      <Header />
      <main className='flex-grow flex items-center justify-center px-margin-mobile py-xl'>
        <div className='premium-card bg-surface-container-lowest w-full max-w-[640px] rounded-xl overflow-hidden border border-outline-variant/30'>
          <div className='h-1.5 w-full bg-secondary'></div>
          <div className='p-md md:p-xl space-y-xl'>
            <PremiumForm />
          </div>
        </div>
      </main>
      <div className='fixed bottom-0 right-0 opacity-10 pointer-events-none hidden lg:block'>
        <img alt='Insurance Protection' className='w-[600px] h-auto object-contain' src='https://lh3.googleusercontent.com/aida-public/AB6AXuB3BF77QdiKFJwFnixRSB6n2GKGom6_wFiBY5hWAGkvNyBPYhFlYAW92s6nVuqtoGhlFfM4PHJrFyHwgZokVHQj3XnCXhDQMkoTtRsaXf7NkUo75IUOX2l83T2i6A9ehi1w6sPPlM4U0kZDWIm2i8KNhYfxE1b6DKPcm1cddVs2HKEs0mxT4Squ4b-drIri25cKzPlX5Ge1uniY3TOkCEjzkxieaXNWXG6gFoW_vBzD6efYuGrjHarPzoGtqiZxX7Anr1hsH2guy_GY' />
      </div>
      <footer className='bg-surface-container-low dark:bg-inverse-surface border-t border-outline-variant w-full px-lg py-md mt-xl'>
        <div className='max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-sm'>
          <div className='font-headline-md text-headline-md text-on-surface opacity-80'>
            AutoGuard
          </div>
          <div className='flex gap-md'>
            <a className='font-label-md text-label-md text-on-surface-variant dark:text-outline-variant hover:underline decoration-primary transition-all duration-200' href='#'>Privacy Policy</a>
            <a className='font-label-md text-label-md text-on-surface-variant dark:text-outline-variant hover:underline decoration-primary transition-all duration-200' href='#'>Terms of Service</a>
            <a className='font-label-md text-label-md text-on-surface-variant dark:text-outline-variant hover:underline decoration-primary transition-all duration-200' href='#'>Contact Us</a>
          </div>
          <p className='font-label-md text-label-md text-on-surface-variant dark:text-outline-variant'>
            © 2024 AutoGuard Insurance Services. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PremiumCalculatorPage;
