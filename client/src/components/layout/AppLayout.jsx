import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout({ children, searchQuery, setSearchQuery }) {
  return (
    <div className='min-h-screen bg-surface-bright text-on-surface font-sans'>
      <Sidebar />
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <main className='ml-[260px] pt-16 min-h-screen pb-8'>
        <div className='max-w-[1440px] mx-auto p-6'>
          {children}
        </div>
      </main>
    </div>
  );
}
