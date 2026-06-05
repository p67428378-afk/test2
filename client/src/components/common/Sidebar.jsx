import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, List, Receipt, Wallet, BarChartHorizontal, BarChart, Terminal, ClipboardCheck, UserCheck } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
  { name: 'Order Entry', path: '/order-entry', icon: <List size={20} /> },
  { name: 'Order Blotter', path: '/order-blotter', icon: <Receipt size={20} /> },
  { name: 'Positions', path: '/positions', icon: <Wallet size={20} /> },
];

const Sidebar = () => {
  return (
    <aside className='w-[220px] bg-secondary-fixed border-r border-outline-variant flex flex-col py-4'>
      <div className='px-4 mb-8'>
        <h1 className='font-title-sm text-lg font-bold text-on-secondary-fixed'>Money Management</h1>
        <p className='font-body-sm text-sm text-on-secondary-fixed-variant opacity-70'>Institutional Portal</p>
      </div>
      <nav className='flex-1'>
        <ul className='space-y-1'>
          {navItems.map((item) => (
            <li key={item.name} className='px-4'>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-on-primary'
                      : 'text-on-secondary-fixed-variant hover:bg-surface-container-high'
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
