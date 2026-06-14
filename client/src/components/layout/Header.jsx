import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authService } from '../../services/api';

const Header = () => {
  const location = useLocation();
  const user = authService.getCurrentUser();
  const initials = user?.login_id ? user.login_id.substring(0, 2).toUpperCase() : 'AM';

  const getBreadcrumbs = () => {
    const path = location.pathname;
    if (path === '/dashboard') {
      return (
        <>
          <span className='mx-2'>/</span>
          <span className='text-primary font-bold'>Dashboard</span>
        </>
      );
    }
    if (path === '/accounts') {
      return (
        <>
          <span className='mx-2'>/</span>
          <span className='text-primary font-bold'>Accounts</span>
        </>
      );
    }
    if (path === '/balance-inquiry') {
      return (
        <>
          <span className='mx-2'>/</span>
          <Link to='/accounts' className='hover:text-primary transition-colors'>Accounts</Link>
          <span className='mx-2'>/</span>
          <span className='text-primary font-bold'>Balance Inquiry</span>
        </>
      );
    }
    if (path === '/audit-logs') {
      return (
        <>
          <span className='mx-2'>/</span>
          <span className='text-primary font-bold'>Audit Logs</span>
        </>
      );
    }
    return null;
  };

  return (
    <header className='fixed top-0 right-0 h-16 w-full md:w-[calc(100%-280px)] bg-surface-container-lowest border-b border-outline-variant shadow-sm z-10 flex justify-between items-center px-4 md:px-8'>
      {/* Breadcrumbs & Mobile Menu */}
      <div className='flex items-center gap-4'>
        <button className='md:hidden text-primary'>
          <span className='material-symbols-outlined'>menu</span>
        </button>
        <nav className='hidden sm:flex text-on-surface-variant font-label-md text-label-md'>
          <Link to='/dashboard' className='hover:text-primary transition-colors'>Home</Link>
          {getBreadcrumbs()}
        </nav>
      </div>

      {/* Right Actions */}
      <div className='flex items-center gap-4'>
        {/* Search */}
        <div className='relative hidden lg:block'>
          <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline'>search</span>
          <input
            className='pl-10 pr-4 py-1.5 bg-surface rounded-full border border-outline-variant text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64'
            placeholder='Search accounts or transactions...'
            type='text'
          />
        </div>

        {/* Notifications */}
        <button className='relative text-on-surface-variant hover:text-primary transition-colors p-2'>
          <span className='material-symbols-outlined'>notifications</span>
          <span className='absolute top-1 right-1 w-4 h-4 bg-error text-on-error rounded-full flex items-center justify-center text-[10px] font-bold'>2</span>
        </button>

        {/* CTA */}
        <button
          onClick={() => authService.logout()}
          className='text-primary font-label-md text-label-md font-bold hover:opacity-80 transition-opacity'
        >
          Secure Logout
        </button>

        {/* Mobile Profile */}
        <div className='w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center md:hidden border border-outline-variant'>
          <span className='font-label-md text-label-md text-on-surface-variant'>{initials}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
