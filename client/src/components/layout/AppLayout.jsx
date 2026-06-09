import React from 'react';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';

export default function AppLayout({ children, activeTab, setActiveTab, onNewQuoteClick, onSearchChange, searchQuery }) {
  return (
    <div className="min-h-screen flex bg-[#0b1326] text-[#dae2fd]">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 md:ml-[280px] flex flex-col min-h-screen relative">
        <Header
          onNewQuoteClick={onNewQuoteClick}
          onSearchChange={onSearchChange}
          searchQuery={searchQuery}
        />
        <main className="flex-1 pt-[96px] pb-16 px-6 md:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}