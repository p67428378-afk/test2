
import React from 'react';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-4">Bank</h2>
      <nav>
        <ul>
          <li className="mb-2">
            <a href="#" className="hover:text-gray-300">Dashboard</a>
          </li>
          <li className="mb-2">
            <a href="#" className="hover:text-gray-300">Admin Panel Settings</a>
          </li>
          <li className="mb-2">
            <a href="#" className="hover:text-gray-300">Access Control</a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
