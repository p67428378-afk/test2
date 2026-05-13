import React from 'react';

const Header = () => {
  return (
    <header className='flex items-center justify-between p-6 bg-white border-b'>
      <h2 className='text-2xl font-semibold text-gray-700'>Dashboard</h2>
      {/* User avatar and dropdown can be added here */}
    </header>
  );
};

export default Header;
