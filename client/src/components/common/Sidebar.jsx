import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  List,
  Receipt,
  Wallet,
} from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/order-entry', icon: <List size={20} />, label: 'Order Entry' },
    { to: '/order-blotter', icon: <Receipt size={20} />, label: 'Order Blotter' },
    { to: '/positions', icon: <Wallet size={20} />, label: 'Positions' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-[200px] z-50 bg-secondary-fixed border-r border-outline-variant flex flex-col py-md overflow-y-auto">
      <div className="px-md mb-xl">
        <h1 className="font-title-sm text-title-sm font-bold text-on-secondary-fixed">Money Management</h1>
        <p className="font-body-sm text-on-secondary-fixed-variant opacity-70">Institutional Portal</p>
      </div>
      <nav className="flex-1">
        <ul className="space-y-xs">
          {navItems.map((item) => (
            <li key={item.to} className="px-md">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-sm py-sm transition-colors hover:bg-surface-container-high pl-md -ml-md ${
                    isActive
                      ? 'text-primary font-bold border-l-4 border-primary'
                      : 'text-on-secondary-fixed-variant hover:text-primary'
                  }`
                }
              >
                {item.icon}
                <span className="font-body-md text-body-md">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto px-md pt-md border-t border-outline-variant flex items-center gap-sm">
        <img
          alt="Trader Profile Avatar"
          className="w-8 h-8 rounded-full bg-surface-container-highest"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHwD-wpbn26iDLSDlJ4xiDCnfo7UgLnV_4g5zhw8X81_wyfS_n9uIXtTfGYZnaG___ZdE5JBG9hZuIDBacvBGa7DRZ0si4u66Z55zM7_rSzIzRNS7_8GTA34rpZCrzBba4TAW4sHnvwh8udpFP4a4pA22lIJ9nVfq3De91kYpw-JFL8OhdbgWmIdjX5sHufM4So7ienIZy20ibKK_Du103spCU6TpN0VyEcR6u4syZ4ZVli72bHAG9RHvGOK-8KP6b-6gKDJobAXbh"
        />
        <div className="overflow-hidden">
          <p className="font-label-caps text-label-caps text-on-secondary-fixed truncate">Alex Thompson</p>
          <p className="font-body-sm text-xs text-on-secondary-fixed-variant truncate">Lead Fund Manager</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
