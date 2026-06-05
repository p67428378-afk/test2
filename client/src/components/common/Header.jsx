import React from 'react';
import { Search, Bell } from 'lucide-react';

const Header = () => {
  return (
    <header className='h-[60px] border-b border-outline-variant flex-shrink-0 bg-surface-container-lowest flex justify-between items-center px-4 md:px-6'>
      <div className='flex items-center'>
        <h2 className='font-headline-md text-xl font-bold text-on-surface'>Trader Dashboard</h2>
      </div>
      <div className='flex items-center gap-4'>
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-outline' size={20} />
          <input
            className='bg-surface-container-low border border-outline-variant rounded-lg pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary w-64 md:w-80'
            placeholder='Search instrument, order, or ticker...'
            type='text'
          />
        </div>
        <div className='flex items-center gap-3'>
          <button className='relative'>
            <Bell className='text-on-surface-variant' />
            <span className='absolute top-0 right-0 block h-2 w-2 rounded-full bg-error ring-2 ring-surface-container-lowest'></span>
          </button>
          <img
            alt='Trader Profile Avatar'
            className='w-8 h-8 rounded-full border border-outline-variant'
            src={`https://i.pravatar.cc/150?u=a042581f4e29026704d`}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
