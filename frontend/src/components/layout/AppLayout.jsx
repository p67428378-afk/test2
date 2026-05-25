import React from 'react';
import Header from './Header';

const AppLayout = ({ children }) => {
  return (
    <div className='min-h-screen bg-gray-100'>
      <Header />
      <main className='p-8'>
        {children}
      </main>
    </div>
  );
};

export default AppLayout;
