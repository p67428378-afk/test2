import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function AppLayout({ children }) {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'dashboard' },
    { path: '/comparison', label: 'Scenario Comparison', icon: 'compare_arrows' },
    { path: '/review', label: 'Approval Review', icon: 'fact_check' },
    { path: '/confirmation', label: 'Confirmation', icon: 'check_circle' },
  ];

  return (
    <div className='min-h-screen flex bg-[#0F172A] text-on-surface font-sans antialiased w-full'>
      {/* SideNavBar */}
      <nav className='hidden md:flex flex-col justify-between py-6 w-[260px] bg-surface-container text-primary-fixed-dim fixed left-0 top-0 h-screen border-r border-outline-variant z-20'>
        <div>
          {/* Header/Brand */}
          <div className='px-6 mb-8 flex flex-col gap-2'>
            <div className='flex items-center gap-2'>
              <img
                alt='Dollar General Logo'
                className='w-8 h-8 rounded'
                src='https://lh3.googleusercontent.com/aida-public/AB6AXuC-eah9RmJ7Zh5ko7lYao4wHYNFP_ACdS_PUEMooHOcwz_e4dNV68bOSNTkQEcprMEkfHqP8Nm7RMj6AM5Ahi-lC5mOOA4RvZ6FyLaA93uRi9RGeZN7Nj3MSKQFxxTdwLhZa2oMHW6vAHWFfZqGxizlMYVYkkm3yn9iRlKoeRJp7t3CHyuSMk5PW-MYqi7EM_CUNGxUFCYnD5VM13cOOA7UXWDtYKkSdoNQQdS2puYdWCxdErHeEzpA2fe-I84PNY3YcQCoXa2TTd8u'
              />
              <span className='font-sans text-2xl font-bold text-primary-fixed-dim'>Enterprise Hub</span>
            </div>
            <div className='flex flex-col'>
              <span className='text-xs text-on-surface-variant'>Category Manager</span>
            </div>
          </div>

          {/* Primary Nav Links */}
          <div className='flex flex-col'>
            {navItems.map((item) => {
              const isActive = currentPath === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-4 px-6 py-3 border-l-4 transition-all duration-200 active:scale-95 ${
                    isActive
                      ? 'border-primary-fixed-dim text-primary-fixed-dim bg-surface-container-high'
                      : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
                  }`}
                >
                  <span className='material-symbols-outlined' style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className='px-6 mt-8'>
            <Link
              to='/comparison'
              className='w-full py-2 px-4 bg-primary-container text-on-primary-fixed text-sm font-bold rounded flex items-center justify-center gap-2 hover:bg-primary transition-colors active:scale-95'
            >
              <span className='material-symbols-outlined text-[18px]'>add</span>
              New Scenario
            </Link>
          </div>
        </div>

        {/* Footer Nav Links */}
        <div className='flex flex-col border-t border-outline-variant pt-4 mt-auto'>
          <a
            href='#settings'
            className='flex items-center gap-4 px-6 py-3 border-l-4 border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all duration-200 active:scale-95'
          >
            <span className='material-symbols-outlined'>settings</span>
            <span>Settings</span>
          </a>
          <a
            href='#support'
            className='flex items-center gap-4 px-6 py-3 border-l-4 border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest transition-all duration-200 active:scale-95'
          >
            <span className='material-symbols-outlined'>help</span>
            <span>Support</span>
          </a>
        </div>
      </nav>

      {/* Main Content Wrapper */}
      <div className='flex-1 ml-0 md:ml-[260px] flex flex-col min-h-screen w-full overflow-x-hidden'>
        {/* TopNavBar */}
        <header className='bg-surface text-primary-fixed-dim fixed top-0 right-0 h-[64px] w-full md:w-[calc(100%-260px)] border-b border-outline-variant flex justify-between items-center px-6 z-10 transition-all duration-300'>
          <div className='flex items-center gap-4 w-full max-w-xl'>
            {/* Search */}
            <div className='relative w-full max-w-md hidden sm:block focus-within:ring-2 focus-within:ring-primary-fixed-dim rounded'>
              <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant'>search</span>
              <input
                className='w-full bg-surface-container-low border border-outline-variant rounded py-2 pl-10 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary-fixed-dim transition-colors'
                placeholder='Search SKU, cluster, or category...'
                type='text'
              />
            </div>
          </div>
          <div className='flex items-center gap-4 ml-auto'>
            <div className='hidden lg:flex flex-col items-end mr-2'>
              <span className='text-xs text-on-surface uppercase tracking-wider font-semibold'>Small Town Value Cluster</span>
              <span className='text-xs text-primary-fixed-dim font-medium'>Snacks Category</span>
            </div>
            <button className='text-on-surface-variant hover:text-primary-fixed-dim hover:bg-surface-container-low transition-colors p-2 rounded-full relative'>
              <span className='material-symbols-outlined'>notifications</span>
              <span className='absolute top-2 right-2 w-2 h-2 bg-primary-container rounded-full'></span>
            </button>
            <button className='text-on-surface-variant hover:text-primary-fixed-dim hover:bg-surface-container-low transition-colors p-1 rounded-full'>
              <img
                alt='User Profile'
                className='w-8 h-8 rounded-full border border-outline-variant'
                src='https://lh3.googleusercontent.com/aida-public/AB6AXuCAxzrqcbkbU3BbTnjyYsV4HG_-EiWhDw5jzspHg_EsxwVfG_az-n2ZiGe7DHRV5gL8KVMgHiozXstM6CY1FqggcLIC2nyEFQ3xgrjCF4G_nXMM3716zksk8K0mMvgHJLW_18mgNieXAbVu_Z2hAYQwzFgiGpwvclH5fnl62rRqYR1Yvc_zynZyKoX9Jmzs0TmCbl_8N81CJPMZN2kfLDb5T4lLjz1SfnRxsGA38W9OdNF4a1ZiUDZKO4bt1iUWx_moBsksk_4Y1YW9'
              />
            </button>
          </div>
        </header>

        {/* Main Canvas */}
        <main className='flex-1 mt-[64px] p-4 md:p-6 max-w-[1440px] mx-auto w-full flex flex-col'>
          {children}
        </main>
      </div>
    </div>
  );
}
