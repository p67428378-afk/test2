import React from 'react';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

export default function AppLayout({ children, title, subtitle }) {
  return (
    <div className='bg-background text-on-background font-body-md min-h-screen flex overflow-hidden'>
      <Sidebar />
      <div className='ml-[280px] flex-1 flex flex-col h-screen overflow-hidden'>
        <Header title={title} subtitle={subtitle} />
        <main className='flex-1 overflow-y-auto p-lg lg:p-container-margin bg-background'>
          <div className='max-w-[1600px] mx-auto space-y-gutter'>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
