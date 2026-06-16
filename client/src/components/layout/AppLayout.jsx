import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout({ children, searchQuery, setSearchQuery }) {
  return (
    <div className='min-h-screen bg-[#0F172A] text-on-surface antialiased'>
      <Sidebar />
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className='ml-[260px] mt-[64px] p-margin-desktop'>
        {children}
      </main>
    </div>
  );
}
