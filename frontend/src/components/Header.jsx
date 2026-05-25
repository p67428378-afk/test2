import React from 'react';

const Header = () => {
  return (
    <header className='fixed top-0 w-full z-50 glass-header shadow-sm'>
      <div className='flex justify-between items-center w-full px-8 h-16 max-w-[1440px] mx-auto'>
        <div className='text-2xl font-extrabold tracking-tight text-primary'>Clinical Sanctuary</div>
        <nav className='hidden md:flex items-center space-x-8'>
          <a className='text-slate-500 hover:text-primary transition-colors font-semibold' href='#'>Home</a>
          <a className='text-primary border-b-2 border-primary pb-1 font-semibold' href='#'>My Policy</a>
          <a className='text-slate-500 hover:text-primary transition-colors font-semibold' href='#'>Profile</a>
          <a className='text-slate-500 hover:text-primary transition-colors font-semibold' href='#'>Help</a>
        </nav>
        <div className='flex items-center space-x-6'>
          <div className='flex items-center space-x-2'>
            <span className='material-symbols-outlined text-secondary'>notifications</span>
            <span className='material-symbols-outlined text-secondary'>settings</span>
          </div>
          <div className='flex items-center space-x-3 pl-4 border-l border-surface-container-high'>
            <div className='text-right hidden sm:block'>
              <p className='text-sm font-bold text-on-surface leading-none'>Alex Johnson</p>
              <p className='text-xs text-on-surface-variant'>Member ID: CS-9921</p>
            </div>
            <img alt='Alex Johnson' className='w-10 h-10 rounded-full object-cover border-2 border-primary-container' src='https://lh3.googleusercontent.com/aida-public/AB6AXuD5vsDH_E0yr-n6TkfobNYDyNkngbuwn22sU8B7i3jYmgTY0EkK9mfZHoGZZkwS-2K2TxlUnm1iaQa5lPl_W5cRgOckxqZMR3tC5U87odCMhc_PoND2feoOHu3NjQCHc1WzALtPCYYN60VGj2epchZQQkgOaae2fWgmm6F1YGRK7ydAPlk4uv_I9kaY_XG0mq3JkM0UNTWTy-SL4cTYGs_HpsE5QBcOPdjjsAqY6nwQYYj_eU5l0IVVxBU49KZhA4o6529v9YTpLrY' />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
