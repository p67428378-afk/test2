import React from 'react';
import { NavLink } from 'react-router-dom';
import { authService } from '../../services/api';

const Sidebar = () => {
  const user = authService.getCurrentUser();
  const initials = user?.login_id ? user.login_id.substring(0, 2).toUpperCase() : 'AM';
  const displayName = user?.login_id || 'Arjun Mehta';

  return (
    <nav className='hidden md:flex flex-col h-screen fixed left-0 top-0 w-[280px] bg-tertiary shadow-md z-20'>
      <div className='flex flex-col h-full py-6'>
        {/* Brand */}
        <div className='px-6 mb-8 flex items-center gap-3'>
          <div className='w-10 h-10 bg-primary-container rounded flex items-center justify-center text-white font-bold text-xl'>
            A
          </div>
          <div>
            <h1 className='font-headline-md text-headline-md font-bold text-white'>ApexBank</h1>
            <p className='font-label-md text-label-md text-tertiary-fixed-dim'>Institutional Strength</p>
          </div>
        </div>

        {/* CTA */}
        <div className='px-6 mb-8'>
          <button className='w-full bg-secondary text-on-secondary font-label-md text-label-md py-3 rounded-lg hover:bg-secondary-fixed hover:text-on-secondary-fixed transition-colors'>
            New Transfer
          </button>
        </div>

        {/* Navigation Links */}
        <div className='flex-1 px-2 space-y-1 overflow-y-auto'>
          <NavLink
            to='/dashboard'
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'text-outline-variant hover:text-white hover:bg-tertiary-container'
              }`
            }
          >
            <span className='material-symbols-outlined'>dashboard</span>
            <span className='font-label-md text-label-md'>Dashboard</span>
          </NavLink>

          <NavLink
            to='/accounts'
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'text-outline-variant hover:text-white hover:bg-tertiary-container'
              }`
            }
          >
            <span className='material-symbols-outlined'>account_balance_wallet</span>
            <span className='font-label-md text-label-md'>Accounts</span>
          </NavLink>

          <NavLink
            to='/balance-inquiry'
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'text-outline-variant hover:text-white hover:bg-tertiary-container'
              }`
            }
          >
            <span className='material-symbols-outlined'>account_balance</span>
            <span className='font-label-md text-label-md'>Balance Inquiry</span>
          </NavLink>

          <NavLink
            to='/audit-logs'
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'text-outline-variant hover:text-white hover:bg-tertiary-container'
              }`
            }
          >
            <span className='material-symbols-outlined'>security</span>
            <span className='font-label-md text-label-md'>Audit Logs</span>
          </NavLink>

          <NavLink
            to='/settings'
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'text-outline-variant hover:text-white hover:bg-tertiary-container'
              }`
            }
          >
            <span className='material-symbols-outlined'>settings</span>
            <span className='font-label-md text-label-md'>Settings</span>
          </NavLink>
        </div>

        {/* Footer Profile */}
        <div className='mt-auto px-6 pt-6 border-t border-tertiary-container'>
          <div className='flex items-center gap-3 mb-2'>
            <div className='w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant font-bold'>
              {initials}
            </div>
            <div>
              <p className='font-label-md text-label-md text-white'>{displayName}</p>
              <p className='font-label-md text-[10px] text-tertiary-fixed-dim'>Retail Customer</p>
            </div>
          </div>
          <div className='flex items-center gap-1 text-[10px] text-[#22c55e]'>
            <span className='material-symbols-outlined text-[12px]'>verified_user</span>
            <span>Session Active (PCI-DSS v4.0)</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
