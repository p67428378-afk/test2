import React from 'react';
import { NavLink } from 'react-router-dom';

const NavItem = ({ to, icon, label }) => {
  const activeClass = 'flex items-center gap-md px-md py-sm text-primary-fixed-dim dark:text-primary font-bold bg-white/10 dark:bg-primary/10 rounded-lg hover:bg-white/5 transition-all';
  const inactiveClass = 'flex items-center gap-md px-md py-sm text-outline-variant dark:text-on-surface-variant hover:bg-white/5 transition-all rounded-lg';

  return (
    <NavLink to={to} className={({ isActive }) => isActive ? activeClass : inactiveClass}>
      <span className='material-icons'>{icon}</span>
      <span className='font-label-md text-label-md'>{label}</span>
    </NavLink>
  );
};

const Sidebar = () => {
  return (
    <aside className='fixed left-0 top-0 h-full w-[240px] bg-inverse-surface dark:bg-surface-container-lowest flex flex-col h-full py-xl px-md z-40 shadow-lg transition-all duration-200 ease-in-out'>
      <div className='mb-xl px-md flex items-center gap-sm'>
        <img alt='Influencer Hub Logo' className='w-8 h-8 rounded' src='data:image/png;base64,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'/>
        <span className='font-headline-md text-headline-md text-primary-fixed'>Hub</span>
      </div>
      <nav className='flex-1 space-y-xs'>
        <NavItem to='/' icon='dashboard' label='Dashboard' />
        <NavItem to='campaigns' icon='campaign' label='Campaigns' />
        <NavItem to='reports' icon='assessment' label='Reports' />
        <NavItem to='/settings' icon='settings' label='Settings' />
      </nav>
      <div className='mt-auto pt-md border-t border-white/10'>
        <button className='w-full mb-md py-sm px-md bg-primary-container text-white rounded-lg font-label-md text-label-md hover:opacity-90 transition-opacity'>
          New Campaign
        </button>
        <NavLink to='/integrations' className={({ isActive }) => isActive ? 'flex items-center gap-md px-md py-sm text-primary-fixed-dim dark:text-primary font-bold bg-white/10 dark:bg-primary/10 rounded-lg hover:bg-white/5 transition-all' : 'flex items-center gap-md px-md py-sm text-outline-variant dark:text-on-surface-variant hover:bg-white/5 transition-all rounded-lg'}>
          <span className='material-icons'>api</span>
          <span className='font-label-md text-label-md'>Integrations</span>
        </NavLink>
        <div className='mt-xl flex items-center gap-md px-md'>
          <div className='w-10 h-10 rounded-full overflow-hidden bg-surface-container-highest'>
            <img alt='Jane Doe' className='w-full h-full object-cover' src='https://lh3.googleusercontent.com/aida-public/AB6AXuAjmvf_zgwBOQmfCyDrirRz4En35qcylJVTsbMdvXhiPYkuNy0Vj1mgMx79Xl4aGJHEeX9JNLm-u-rxY8SHC5byXLtJXE1ADQ_WfQVy03A4bBZ2fojdc0H_6FdQRW67KXDzf0I7-fIF22NFmgqDZIN4LuIyBNuTFBtOrU27EwNPuIa4Nq60e0cXg6Df9kSkNqhFSxbKIRAqA862A6shW1Ro-HfSngqmDWgC4WG1LlVUITpjbj7oIjQVP5h9SQ39j51Du5RUzJ-OctxP'/>
          </div>
          <div className='overflow-hidden'>
            <p className='font-label-md text-label-md text-primary-fixed truncate'>Jane Doe</p>
            <p className='text-[10px] text-outline-variant uppercase tracking-wider'>Influencer Account</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
