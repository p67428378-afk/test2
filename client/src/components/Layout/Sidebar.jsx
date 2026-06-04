import React from 'react';
import { LayoutDashboard, ArrowRightLeft, Landmark } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/transfer', icon: ArrowRightLeft, label: 'Transfers' },
    // Add more links as needed
  ];

  return (
    <aside className="w-60 bg-surface-container-low p-4 border-r border-outline-variant/20">
      <nav className="flex flex-col gap-2">
        {navLinks.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-container text-on-primary-container'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
