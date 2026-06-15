import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout({ children, currentFilter, onFilterChange, searchQuery, onSearchChange }) {
  return (
    <div className='flex h-screen w-screen overflow-hidden antialiased font-body-md text-body-md bg-[#0B1326] text-[#dae2fd]'>
      <Sidebar currentFilter={currentFilter} onFilterChange={onFilterChange} />
      <div className='flex-1 ml-0 md:ml-[260px] flex flex-col h-full overflow-hidden'>
        <Header searchQuery={searchQuery} onSearchChange={onSearchChange} />
        <main className='flex-1 overflow-y-auto p-4 md:p-8'>
          <div className='max-w-6xl mx-auto space-y-8'>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
