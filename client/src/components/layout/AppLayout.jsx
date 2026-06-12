import React from 'react';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

export default function AppLayout({ children, activeTab, setActiveTab, title }) {
  return (
    <div className='font-body-md text-body-md antialiased overflow-hidden flex h-screen bg-[#0F172A] text-[#dae2fd]'>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className='flex-1 ml-[260px] flex flex-col h-screen overflow-hidden'>
        <Header title={title} />
        <main className='flex-1 overflow-y-auto p-gutter bg-background'>
          <div className='max-w-[1440px] mx-auto space-y-gutter'>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}