import React from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../Movies/SearchBar';
import UserProfileDropdown from '../User/UserProfileDropdown';

const Header = () => {
  return (
    <header className='fixed top-0 right-0 left-64 z-40 bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm flex justify-between items-center px-container-padding-desktop py-4'>
      <div className='flex items-center gap-8'>
        <div className='flex gap-6'>
          <Link to='/movies' className='text-primary font-bold border-b-2 border-primary pb-1 font-body-md text-body-md'>Movies</Link>
          <Link to='/tv' className='text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors duration-200'>TV Shows</Link>
          <Link to='/list' className='text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors duration-200'>My List</Link>
        </div>
      </div>
      <div className='flex items-center gap-6'>
        <SearchBar />
        <button className='text-on-surface-variant hover:text-primary transition-all active:scale-95'>
          <span className='material-symbols-outlined'>notifications</span>
        </button>
        <UserProfileDropdown />
      </div>
    </header>
  );
};

export default Header;
