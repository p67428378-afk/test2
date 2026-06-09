import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const AppLayout = ({ children, searchTerm, onSearchChange }) => {
  return (
    <div className='min-h-screen bg-background text-on-background'>
      <Sidebar />
      <Header searchTerm={searchTerm} onSearchChange={onSearchChange} />
      <main className='pt-[88px] pl-[260px] pr-6 pb-8 min-h-screen'>
        <div className='max-w-[1400px] mx-auto space-y-6'>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
