import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Gem, ShoppingCart, Users, BarChart2 } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/inventory', icon: <Gem size={20} />, label: 'Inventory' },
    { to: '/sales', icon: <ShoppingCart size={20} />, label: 'Sales' },
    { to: '/customers', icon: <Users size={20} />, label: 'Customers' },
    { to: '/reports', icon: <BarChart2 size={20} />, label: 'Reports' },
  ];

  return (
    <aside className='w-64 bg-white text-gray-800 p-4'>
      <div className='text-2xl font-bold mb-8'>JMS</div>
      <nav>
        <ul>
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg transition-colors duration-200 ${isActive ? 'bg-green-500 text-white' : 'hover:bg-gray-200'}`
                }
              >
                {item.icon}
                <span className='ml-3'>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
