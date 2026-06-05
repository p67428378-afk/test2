import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const AppLayout = () => {
  return (
    <div className='bg-background text-on-surface flex h-screen'>
      <Sidebar />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <Header />
        <main className='flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 custom-scrollbar'>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
