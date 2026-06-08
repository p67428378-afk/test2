import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout({ children }) {
  return (
    <div className='flex min-h-screen text-on-background font-body-md bg-[#0F172A]'>
      <Sidebar />
      <div className='flex-1 ml-[260px] min-h-screen flex flex-col'>
        <Header />
        <main className='mt-[64px] p-margin flex-1 max-w-[1600px] w-full mx-auto'>
          {children}
        </main>
      </div>
    </div>
  );
}
