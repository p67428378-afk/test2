import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  return (
    <nav className='bg-surface-container-lowest border-r border-outline-variant fixed left-0 top-0 h-screen w-[260px] flex flex-col py-6 px-4 z-20'>
      <div className='mb-8'>
        <h1 className='text-xl text-primary font-bold'>ConnectHub</h1>
        <p className='text-xs text-on-surface-variant'>Management System</p>
      </div>
      <ul className='flex flex-col gap-2 flex-1'>
        <li>
          <Link
            to='/'
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
              location.pathname === '/'
                ? 'text-primary bg-secondary-container border-l-2 border-primary'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span className='material-symbols-outlined'>contacts</span>
            <span className='text-sm font-medium'>Contacts</span>
          </Link>
        </li>
        <li>
          <Link
            to='/add'
            className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
              location.pathname === '/add'
                ? 'text-primary bg-secondary-container border-l-2 border-primary'
                : 'text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            <span className='material-symbols-outlined'>person_add</span>
            <span className='text-sm font-medium'>Add Contact</span>
          </Link>
        </li>
        <li>
          <a
            href='#'
            className='flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors duration-200'
          >
            <span className='material-symbols-outlined'>group</span>
            <span className='text-sm font-medium'>Groups</span>
          </a>
        </li>
        <li>
          <a
            href='#'
            className='flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors duration-200'
          >
            <span className='material-symbols-outlined'>settings</span>
            <span className='text-sm font-medium'>Settings</span>
          </a>
        </li>
      </ul>
      <div className='mt-auto'>
        <a
          href='#'
          className='flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors duration-200'
        >
          <span className='material-symbols-outlined'>person</span>
          <span className='text-sm font-medium'>Alex Rivera</span>
        </a>
      </div>
    </nav>
  );
}
