import React from 'react';

const Header = () => {
  return (
    <header className='fixed top-0 right-0 h-[64px] left-[280px] bg-surface border-b border-outline-variant flex justify-between items-center px-container-padding z-40'>
      <div className='flex items-center gap-4'>
        <h2 className='font-h3 text-h3 font-bold text-primary'>Snacks Management Dashboard</h2>
      </div>
      <div className='flex items-center gap-6'>
        <div className='relative flex items-center bg-surface-container px-3 py-1.5 rounded-full border border-outline-variant'>
          <span className='material-symbols-outlined text-on-surface-variant mr-2' data-icon='search'>search</span>
          <input className='bg-transparent border-none focus:ring-0 text-body-sm w-48 text-on-surface' placeholder='Search snacks...' type='text' />
        </div>
        <div className='flex items-center gap-3'>
          <button className='text-on-surface-variant hover:text-primary transition-colors'>
            <span className='material-symbols-outlined' data-icon='notifications'>notifications</span>
          </button>
          <button className='text-on-surface-variant hover:text-primary transition-colors'>
            <span className='material-symbols-outlined' data-icon='settings'>settings</span>
          </button>
          <div className='h-8 w-[1px] bg-outline-variant'></div>
          <div className='flex items-center gap-3'>
            <div className='text-right hidden xl:block'>
              <p className='font-label-md text-label-md text-on-surface leading-tight'>Chef Gordon</p>
              <p className='font-label-sm text-label-sm text-on-surface-variant leading-tight'>Master Admin</p>
            </div>
            <img alt='Chef User Profile' className='w-10 h-10 rounded-full border border-outline shadow-sm object-cover' src='https://lh3.googleusercontent.com/aida-public/AB6AXuApqOyeZIy8kLCXo-e6SiZIVNH0DsNIIReO6lotnRsFUYDrz-DspUn7ENnsazIdodE_2WSjub5QNr0qzDrWa7-6x58pKHmYBOhckq_7SxLJ1vBApbeEsWDfATkqPum6kBQoduXxbk6cNfj4EVJdxQBgnDoP0o9nKxtLIzcBPSa8YyemaObRrKZnhmBVifbBl9VWROMIcTNw0uXR502g1_kbFRflazGXJtEQAxZifM55sco_ZfBQhZyTmDQBqWnozth8SLbmdW9o5p5b' />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
