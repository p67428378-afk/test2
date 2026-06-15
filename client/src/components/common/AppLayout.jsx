import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const AppLayout = ({ children }) => {
  return (
    <div className='bg-background text-on-surface flex h-screen'>
      <Sidebar />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <Header />
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-surface p-4 md:p-6 lg:p-8'>
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
