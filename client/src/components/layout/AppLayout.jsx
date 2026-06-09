import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout({ children, searchQuery, setSearchQuery }) {
  return (
    <div className='min-h-screen flex bg-background text-on-surface font-sans'>
      <Sidebar />
      <div className='ml-[260px] flex-1 flex flex-col min-h-screen'>
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <main className='flex-1 p-xl overflow-y-auto'>
          {children}
        </main>
      </div>
    </div>
  );
}
