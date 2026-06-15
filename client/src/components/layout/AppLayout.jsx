import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout({ children, activeTab, setActiveTab }) {
  return (
    <div className='text-on-surface flex min-h-screen bg-slate-bg'>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className='ml-[280px] w-full flex flex-col'>
        <Header />
        <main className='flex-1 mt-16 p-8 overflow-y-auto'>
          <div className='max-w-7xl mx-auto space-y-6'>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
