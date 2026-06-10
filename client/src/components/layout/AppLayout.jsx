import React from 'react';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

export default function AppLayout({ children }) {
  return (
    <div className='flex h-screen overflow-hidden bg-background text-on-background font-body-md antialiased'>
      <Sidebar />
      <div className='flex-1 ml-[260px] flex flex-col h-screen overflow-hidden'>
        <Header />
        <main className='flex-1 mt-16 p-6 overflow-y-auto w-full max-w-[1440px] mx-auto'>
          {children}
        </main>
      </div>
    </div>
  );
}
