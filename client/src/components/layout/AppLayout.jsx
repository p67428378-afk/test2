import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout({ children }) {
  return (
    <div className='min-h-screen bg-[#0F172A] text-[#d4e4fa]'>
      <Sidebar />
      <Header />
      <main className='pt-[88px] pb-12 px-8 md:ml-[260px] min-h-screen'>
        {children}
      </main>
    </div>
  );
}
