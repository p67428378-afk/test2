import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

export default function AppLayout({ children, activeTab, setActiveTab }) {
  return (
    <div className='min-h-screen flex flex-col bg-surface text-on-surface font-body-md overflow-hidden antialiased'>
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className='flex-1 mt-[64px] flex flex-row h-[calc(100vh-64px)] overflow-hidden'>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className='flex-1 flex flex-col md:flex-row p-margin-desktop gap-lg h-full overflow-hidden'>
          {children}
        </main>
      </div>
    </div>
  );
}
