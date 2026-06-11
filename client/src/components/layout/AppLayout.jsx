import React from 'react';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

export default function AppLayout({ children, currentPage, setCurrentPage, onNewBooking, title, searchQuery, setSearchQuery }) {
  return (
    <div className='text-on-surface antialiased flex h-screen overflow-hidden w-full bg-[#0F172A]'>
      <Sidebar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        onNewBooking={onNewBooking} 
      />
      <div className='flex-1 flex flex-col ml-0 md:ml-[280px] w-full md:w-[calc(100%-280px)] h-screen overflow-hidden'>
        <Header 
          title={title} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        <main className='flex-1 overflow-y-auto p-4 md:p-8'>
          <div className='max-w-[1600px] mx-auto flex flex-col gap-6'>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}