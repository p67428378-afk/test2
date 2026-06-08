import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className='fixed left-0 top-0 h-full w-[280px] bg-surface border-r border-outline-variant flex flex-col z-50'>
      {/* Header */}
      <div className='px-lg py-xl border-b border-outline-variant flex items-center gap-md'>
        <div className='w-10 h-10 rounded-full bg-primary-container flex items-center justify-center shrink-0'>
          <span className='material-symbols-outlined fill text-on-primary-container text-[24px]'>account_balance</span>
        </div>
        <div>
          <h1 className='text-headline-md font-headline-md text-on-surface leading-tight'>National Fiscal Portal</h1>
          <p className='text-label-sm font-label-sm text-on-surface-variant uppercase mt-1'>Fiscal Monitoring</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className='flex-1 py-lg flex flex-col gap-sm overflow-y-auto'>
        <Link
          to='/'
          className={`flex items-center gap-md px-lg py-md transition-colors ${
            isActive('/')
              ? 'text-on-surface font-bold border-l-4 border-primary bg-surface-container-high'
              : 'text-on-surface-variant hover:bg-surface-bright'
          }`}
        >
          <span className='material-symbols-outlined'>dashboard</span>
          <span className='text-label-md font-label-md'>Dashboard</span>
        </Link>

        <Link
          to='/budget-variance'
          className={`flex items-center gap-md px-lg py-md transition-colors ${
            isActive('/budget-variance')
              ? 'text-on-surface font-bold border-l-4 border-primary bg-surface-container-high'
              : 'text-on-surface-variant hover:bg-surface-bright'
          }`}
        >
          <span className='material-symbols-outlined'>analytics</span>
          <span className='text-label-md font-label-md'>Budget Variance</span>
        </Link>

        <Link
          to='/emergency-funds'
          className={`flex items-center gap-md px-lg py-md transition-colors ${
            isActive('/emergency-funds')
              ? 'text-on-surface font-bold border-l-4 border-primary bg-surface-container-high'
              : 'text-on-surface-variant hover:bg-surface-bright'
          }`}
        >
          <span className='material-symbols-outlined'>emergency</span>
          <span className='text-label-md font-label-md'>Emergency Funds</span>
        </Link>
      </nav>

      {/* Footer */}
      <div className='p-lg border-t border-outline-variant flex items-center gap-md hover:bg-surface-bright transition-colors cursor-pointer'>
        <div className='w-8 h-8 rounded-full bg-surface-variant overflow-hidden shrink-0 border border-outline-variant'>
          <img
            alt="Hon. Finance Minister"
            className='w-full h-full object-cover'
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTccx98qAwqN3b_8nGu4MxRQrPmoLOPthm7ueKs20nwBi0rHDzhezrYZ05Y6tu_573pAEky6ff6jaHWhZ-4FqAyTPO1scxaiXTHYfbHOuwbi_ITelwagDVp36rUx_WCWn11AdwD462BjjQet8W57r78uNxbxP9dLKXKFKRz7u8ymgGgMtEcqiwMAXwTlYFbMRjZiluIbZ1iTeEnXOwIPF-fj-rnH9X4XUmJ3YHm7x5NUiEfcK_30zpGnHC2udGn5b80vj0rwUsvSg"
          />
        </div>
        <div className='flex-1 min-w-0'>
          <p className='text-label-md font-label-md text-on-surface truncate'>Hon. Finance Minister</p>
          <p className='text-label-sm font-label-sm text-on-surface-variant uppercase mt-0.5 truncate'>Finance Minister</p>
        </div>
        <span className='material-symbols-outlined text-on-surface-variant text-[20px]'>expand_more</span>
      </div>
    </aside>
  );
}
