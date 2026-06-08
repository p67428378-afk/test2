import React, { useState } from 'react';
import TopNavBar from './components/layout/TopNavBar';
import RequestInitiationPage from './pages/RequestInitiationPage';
import DualOTPVerificationPage from './pages/DualOTPVerificationPage';
import StatusConfirmationPage from './pages/StatusConfirmationPage';

export default function App() {
  const [step, setStep] = useState(1); // 1: Initiation, 2: Verification, 3: Confirmation
  const [requestId, setRequestId] = useState('');
  const [status, setStatus] = useState(''); // PENDING_OLD_OTP, PENDING_NEW_OTP, COMPLETED, FAILED
  const [error, setError] = useState('');

  const handleInitiationNext = (reqId, nextStatus) => {
    setRequestId(reqId);
    setStatus(nextStatus);
    setStep(2);
  };

  const handleVerificationNext = (nextStatus) => {
    setStatus(nextStatus);
    if (nextStatus === 'COMPLETED' || nextStatus === 'FAILED') {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (status === 'PENDING_NEW_OTP') {
      setStatus('PENDING_OLD_OTP');
    } else {
      setStep(1);
      setRequestId('');
      setStatus('');
    }
  };

  const handleReset = () => {
    setStep(1);
    setRequestId('');
    setStatus('');
    setError('');
  };

  return (
    <div className='min-h-screen flex flex-col bg-[#f8f9ff] text-[#0b1c30] font-sans'>
      <TopNavBar />
      
      <main className='flex-grow flex items-center justify-center pt-24 pb-12 px-margin-mobile md:px-margin-desktop'>
        {step === 1 && (
          <RequestInitiationPage onNext={handleInitiationNext} />
        )}
        {step === 2 && (
          <DualOTPVerificationPage
            requestId={requestId}
            status={status}
            onNext={handleVerificationNext}
            onBack={handleBack}
          />
        )}
        {step === 3 && (
          <StatusConfirmationPage
            status={status}
            onReset={handleReset}
            error={error}
          />
        )}
      </main>

      <footer className='bg-surface-container-low dark:bg-surface-container-highest text-on-surface dark:text-on-surface-variant w-full py-lg border-t border-outline-variant flex flex-col md:flex-row justify-between items-center px-margin-desktop py-md'>
        <div className='mb-md md:mb-0 flex items-center gap-2'>
          <span className='font-label-md text-label-md font-bold text-primary'>Apex Bank</span>
          <span className='font-label-sm text-label-sm ml-sm text-on-surface-variant'>
            © 2024 Apex Bank. All rights reserved. Member FDIC. Equal Housing Lender.
          </span>
        </div>
        <nav>
          <ul className='flex flex-wrap items-center justify-center md:justify-end gap-md'>
            <li><a className='font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer' href='#'>Privacy Policy</a></li>
            <li><a className='font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer' href='#'>Security Terms</a></li>
            <li><a className='font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer' href='#'>Accessibility</a></li>
            <li><a className='font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors cursor-pointer' href='#'>Contact Us</a></li>
          </ul>
        </nav>
      </footer>
    </div>
  );
}
