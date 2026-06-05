import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListTodo, Receipt, Wallet, BarChart, GanttChart, Share, CheckCircle } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
  { name: 'Order Entry', path: '/orders/new', icon: <ListTodo size={20} /> },
  { name: 'Order Blotter', path: '/orders', icon: <Receipt size={20} /> },
  { name: 'Positions', path: '/positions', icon: <Wallet size={20} /> },
  { name: 'Market Data', path: '/market-data', icon: <BarChart size={20} /> },
  { name: 'Program Trades', path: '/program-trades', icon: <GanttChart size={20} /> },
  { name: 'Post-Trade', path: '/post-trade', icon: <Share size={20} /> },
  { name: 'Affirmation', path: '/affirmation', icon: <CheckCircle size={20} /> },
];

const Sidebar = () => {
  const baseLinkClasses = 'flex items-center gap-3 px-4 py-2 text-on-secondary-fixed-variant transition-colors duration-150 rounded-md';
  const hoverClasses = 'hover:bg-surface-container-high hover:text-primary';
  const activeLinkClasses = 'bg-primary/10 text-primary font-bold';

  return (
    <aside className="fixed left-0 top-0 h-full w-[220px] z-50 bg-secondary-fixed border-r border-outline-variant flex flex-col p-3 overflow-y-auto custom-scrollbar">
      <div className="px-4 mb-6 mt-2">
        <h1 className="font-title-sm text-lg font-bold text-on-secondary-fixed">Money Mgmt</h1>
        <p className="font-body-sm text-sm text-on-secondary-fixed-variant opacity-80">Institutional Portal</p>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => 
                  `${baseLinkClasses} ${hoverClasses} ${isActive ? activeLinkClasses : ''}`
                }
              >
                {item.icon}
                <span className="font-body-md text-sm">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto p-3 border-t border-outline-variant flex items-center gap-3">
        <img alt="Trader Profile Avatar" className="w-10 h-10 rounded-full bg-surface-container-highest" src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
        <div className="overflow-hidden">
          <p className="font-label-caps text-sm font-semibold text-on-secondary-fixed truncate">Alex Thompson</p>
          <p className="font-body-sm text-xs text-on-secondary-fixed-variant truncate">Lead Fund Manager</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
