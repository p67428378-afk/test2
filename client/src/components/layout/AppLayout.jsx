import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout({ children, onSearchChange, searchValue }) {
  return (
    <div className="w-full h-full flex overflow-hidden bg-background text-on-surface">
      <Sidebar />
      <main className="flex-1 flex flex-col md:ml-[260px] h-full relative z-10 overflow-hidden">
        <Header onSearchChange={onSearchChange} searchValue={searchValue} />
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-background custom-scrollbar">
          <div className="max-w-[1600px] mx-auto space-y-6">
            {children}
          </div>
          <div className="h-12"></div>
        </div>
      </main>
    </div>
  );
}