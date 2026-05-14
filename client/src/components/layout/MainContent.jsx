import React from 'react';

const MainContent = ({ children }) => {
  return (
    <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6'>
      {children}
    </main>
  );
};

export default MainContent;
