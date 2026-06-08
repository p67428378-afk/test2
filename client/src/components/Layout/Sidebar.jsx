import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <aside className='fixed left-0 top-0 h-full w-64 bg-surface-container border-r border-outline-variant/20 flex flex-col py-section-gap z-50'>
      <div className='px-6 mb-10 flex items-center gap-3'>
        <div className='w-10 h-10 rounded-xl bg-primary flex items-center justify-center'>
          <span className='material-symbols-outlined text-on-primary' style={{ fontVariationSettings: "'FILL' 1" }}>movie</span>
        </div>
        <div>
          <h1 className='font-display text-h2 text-primary tracking-tighter'>CineGlow</h1>
          <p className='font-label-sm text-on-surface-variant/70 uppercase tracking-widest'>Premium Cinema</p>
        </div>
      </div>
      <nav className='flex-1 flex flex-col gap-2 px-4'>
        <NavLink to='/' className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-transform active:scale-[0.98] ${isActive ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface'}`}>
          <span className='material-symbols-outlined'>home</span>
          <span className='font-body-md text-body-md'>Home</span>
        </NavLink>
        <NavLink to='/movies' className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-transform active:scale-[0.98] ${isActive ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface'}`}>
          <span className='material-symbols-outlined'>movie</span>
          <span className='font-body-md text-body-md'>Movies</span>
        </NavLink>
        <NavLink to='/tv' className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-transform active:scale-[0.98] ${isActive ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface'}`}>
          <span className='material-symbols-outlined'>tv</span>
          <span className='font-body-md text-body-md'>TV Shows</span>
        </NavLink>
        <NavLink to='/list' className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-transform active:scale-[0.98] ${isActive ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface'}`}>
          <span className='material-symbols-outlined'>format_list_bulleted</span>
          <span className='font-body-md text-body-md'>My List</span>
        </NavLink>
        <div className='mt-8 mb-4 px-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest opacity-50'>Account</div>
        <NavLink to='/profile' className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl transition-transform active:scale-[0.98] ${isActive ? 'bg-primary-container text-on-primary-container font-bold' : 'text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface'}`}>
          <span className='material-symbols-outlined'>settings</span>
          <span className='font-body-md text-body-md'>Settings</span>
        </NavLink>
      </nav>
      <div className='px-6 mt-auto'>
        <div className='bg-gradient-to-br from-primary-container to-secondary-container rounded-2xl p-4 mb-8'>
          <h4 className='font-h3 text-white mb-1'>CineGlow Pro</h4>
          <p className='text-xs text-white/80 mb-3'>Unlimited 4K streaming and offline downloads.</p>
          <button className='w-full py-2 bg-white text-on-primary-container rounded-lg font-bold text-sm hover:bg-opacity-90 transition-all'>Upgrade Now</button>
        </div>
        <div className='flex flex-col gap-2'>
          <a className='flex items-center gap-3 text-on-surface-variant px-4 py-2 hover:text-on-surface text-sm transition-all' href="#">
            <span className='material-symbols-outlined text-lg'>help</span>
            <span>Help Center</span>
          </a>
          <button onClick={handleLogout} className='flex items-center gap-3 text-on-surface-variant px-4 py-2 hover:text-error text-sm transition-all'>
            <span className='material-symbols-outlined text-lg'>logout</span>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
