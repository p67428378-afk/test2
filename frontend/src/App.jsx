import React from 'react';
import TopNavBar from './components/TopNavBar';
import SideNavBar from './components/SideNavBar';
import AadhaarInput from './components/AadhaarInput';
import PanInput from './components/PanInput';
import StatusIndicator from './components/StatusIndicator';
import AuditTrail from './components/AuditTrail';

function App() {
  return (
    <div className='bg-surface font-body text-on-surface'>
      <TopNavBar />
      <SideNavBar />
      <main className='ml-72 pt-24 px-12 pb-12 min-h-screen'>
        <header className='mb-12'>
          <h1 className='font-headline text-4xl font-extrabold text-on-surface tracking-tight mb-2'>Verification Pipeline</h1>
          <p className='text-on-surface-variant font-body max-w-2xl'>Complete the institutional onboarding process by providing the required cryptographic credentials and identification documents for architectural compliance.</p>
        </header>
        <div className='grid grid-cols-12 gap-8'>
          <div className='col-span-8 grid grid-cols-2 gap-8'>
            <AadhaarInput />
            <PanInput />
            <AuditTrail />
          </div>
          <div className='col-span-4 space-y-8'>
            <StatusIndicator />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
