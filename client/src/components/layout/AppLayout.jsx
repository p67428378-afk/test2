import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout({ children, activeTab, setActiveTab, onRegisterClick }) {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <Header onRegisterClick={onRegisterClick} />
      <main className="ml-[260px] pt-[64px] min-h-screen p-margin-desktop overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}