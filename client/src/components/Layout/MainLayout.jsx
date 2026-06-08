import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const MainLayout = () => {
  return (
    <div className='flex min-h-screen'>
      <Sidebar />
      <main className='ml-64 flex-1 flex flex-col min-h-screen'>
        <Header />
        <div className='pt-24 pb-section-gap px-container-padding-desktop flex flex-col gap-section-gap'>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
