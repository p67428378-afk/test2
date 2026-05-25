import React from 'react';
import TopNavBar from './components/TopNavBar';
import SideNavBar from './components/SideNavBar';
import AadhaarInput from './components/AadhaarInput';
import PanInput from './components/PanInput';
import StatusIndicator from './components/StatusIndicator';
import AuditTrail from './components/AuditTrail';

function App() {
  return (
    <div className='text-on-surface'>
      <TopNavBar />
      <SideNavBar />
      <main className='ml-64 mt-16 p-10 min-h-screen'>
        <header className='mb-10'>
          <div className='flex items-end justify-between'>
            <div>
              <span className='text-xs font-bold text-primary tracking-[0.2em] uppercase mb-2 block'>Institutional Onboarding</span>
              <h1 className='text-4xl font-headline font-extrabold text-on-surface tracking-tight'>KYC Verification Portal</h1>
            </div>
            <div className='text-right'>
              <p className='text-sm font-medium text-on-surface-variant mb-1'>Session ID: <span className='font-mono'>KV-99021-X</span></p>
              <p className='text-xs text-outline tracking-wider'>LAST UPDATED: 12 OCT 2023 14:32 UTC</p>
            </div>
          </div>
        </header>
        <div className='grid grid-cols-12 gap-8 mb-8'>
          <AadhaarInput />
          <PanInput />
          <StatusIndicator />
        </div>
        <AuditTrail />
      </main>
      <button className='fixed bottom-8 right-8 w-14 h-14 bg-gradient-primary text-white rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-90 group z-50'>
        <span className='material-symbols-outlined text-2xl' style={{fontVariationSettings: '\'FILL\' 1'}}>add</span>
        <div className='absolute right-full mr-4 bg-on-surface text-surface text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none'>
            New Entity
        </div>
      </button>
    </div>
  );
}

export default App;
