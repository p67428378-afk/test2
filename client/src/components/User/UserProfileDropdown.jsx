import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getUserProfile } from '../../services/api';

const UserProfileDropdown = () => {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getUserProfile();
        setUser(data);
      } catch (error) {
        console.error('Failed to fetch user profile', error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (!user) {
    return null;
  }

  return (
    <div className='relative' ref={dropdownRef}>
      <div className='flex items-center gap-3 pl-2 cursor-pointer' onClick={() => setIsOpen(!isOpen)}>
        <div className='text-right'>
          <p className='text-sm font-bold text-on-surface'>{user.email}</p>
          <p className='text-[10px] text-on-surface-variant uppercase tracking-tighter'>Premium Member</p>
        </div>
        <img alt='User profile photo' className='w-10 h-10 rounded-full border-2 border-outline-variant/30' src={'https://via.placeholder.com/150'} />
      </div>
      {isOpen && (
        <div className='absolute right-0 mt-2 w-48 bg-surface-container rounded-lg shadow-lg py-1 z-50'>
          <Link to='/profile' className='block px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-variant/50'>Profile</Link>
          <Link to='/history' className='block px-4 py-2 text-sm text-on-surface-variant hover:bg-surface-variant/50'>Watch History</Link>
          <button onClick={handleLogout} className='w-full text-left px-4 py-2 text-sm text-error hover:bg-surface-variant/50'>Logout</button>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;
