
import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Debit Card Management</h1>
      <div>
        <a href="#" className="text-gray-600 hover:text-gray-800 mr-4">Notifications</a>
        <a href="#" className="text-gray-600 hover:text-gray-800 mr-4">Settings</a>
        <a href="#" className="text-red-600 hover:text-red-800 font-bold">Emergency Block</a>
      </div>
    </header>
  );
};

export default Header;
