import React from 'react';

const Header = () => {
  return (
    <header className='fixed top-0 left-0 w-full z-50 flex items-center px-4 h-16 bg-[#f7f9fb] dark:bg-[#191c1e]'>
      <div className='flex items-center w-full justify-between'>
        <div className='flex items-center gap-4'>
          <button className='hover:bg-[#e0e3e5] dark:hover:bg-[#44474e] transition-colors active:scale-95 duration-150 ease-in-out p-2 rounded-full'>
            <span className='material-symbols-outlined text-[#002D72] dark:text-[#d6e3ff]'>arrow_back</span>
          </button>
          <h1 className='font-['Manrope'] font-bold tracking-tight text-on-surface text-[#002D72] dark:text-[#d6e3ff] text-xl'>Statements</h1>
        </div>
        <button className='hover:bg-[#e0e3e5] dark:hover:bg-[#44474e] transition-colors active:scale-95 duration-150 ease-in-out p-2 rounded-full'>
          <span className='material-symbols-outlined text-[#002D72] dark:text-[#d6e3ff]'>help_outline</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
