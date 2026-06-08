import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'dashboard' },
    { path: '/alerts', label: 'Alerts', icon: 'warning' },
    { path: '/maintenance', label: 'Maintenance', icon: 'engineering' },
  ];

  return (
    <aside className='fixed left-0 top-0 h-full w-[260px] bg-surface-container border-r border-outline-variant flex flex-col py-lg z-50'>
      <div className='px-lg mb-xl flex items-center gap-sm'>
        <div className='w-8 h-8 rounded bg-primary flex items-center justify-center text-on-primary font-bold text-lg'>
          S
        </div>
        <div className='flex flex-col'>
          <span className='font-headline-md text-headline-md font-bold text-primary'>SafePipe</span>
          <span className='font-label-mono text-label-mono text-on-surface-variant'>Gas Pipeline Management</span>
        </div>
      </div>
      <nav className='flex-1 space-y-xs'>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-md px-lg py-sm transition-all duration-150 ${
                isActive
                  ? 'text-on-primary-container border-l-4 border-primary bg-secondary-container/20'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className='material-symbols-outlined'>{item.icon}</span>
              <span className='font-label-mono text-label-mono'>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className='px-lg mt-auto pt-lg border-t border-outline-variant'>
        <div className='flex items-center gap-md p-sm rounded-lg hover:bg-surface-container-high cursor-pointer transition-colors'>
          <div className='w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container'>
            <span className='material-symbols-outlined'>person</span>
          </div>
          <div className='flex flex-col overflow-hidden'>
            <span className='font-body-md text-body-md font-semibold truncate'>Alex Mercer</span>
            <span className='font-body-sm text-body-sm text-on-surface-variant'>Chief Engineer</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
