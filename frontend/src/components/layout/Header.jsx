import React from 'react';

const Header = () => {
  return (
    <header className='bg-gray-800 text-white p-4 flex justify-between items-center'>
      <div className='text-xl font-bold'>Netbanking</div>
      <div>
        <span className='material-symbols-outlined'>
          account_circle
        </span>
      </div>
    </header>
  );
};

export default Header;
