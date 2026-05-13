import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, ShoppingCart, Users, BarChart2 } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className='w-64 bg-white shadow-md'>
      <div className='p-6'>
        <h1 className='text-2xl font-bold text-gray-800'>JewelFlow</h1>
      </div>
      <nav className='mt-6'>
        <NavLink to='/' className='flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800'>
          <Home className='w-5 h-5' />
          <span className='mx-4'>Dashboard</span>
        </NavLink>
        <NavLink to='/inventory' className='flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800'>
          <Package className='w-5 h-5' />
          <span className='mx-4'>Inventory</span>
        </NavLink>
        <NavLink to='/sales' className='flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800'>
          <ShoppingCart className='w-5 h-5' />
          <span className='mx-4'>Sales</span>
        </NavLink>
        <NavLink to='/customers' className='flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800'>
          <Users className='w-5 h-5' />
          <span className='mx-4'>Customers</span>
        </NavLink>
        <NavLink to='/reports' className='flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100 hover:text-gray-800'>
          <BarChart2 className='w-5 h-5' />
          <span className='mx-4'>Reports</span>
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
