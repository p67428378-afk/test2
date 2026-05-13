import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MainContent from './MainContent';

const AppLayout = ({ children }) => {
  return (
    <div className='flex h-screen bg-gray-100'>
      <Sidebar />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <Header />
        <MainContent>{children}</MainContent>
      </div>
    </div>
  );
};

export default AppLayout;
