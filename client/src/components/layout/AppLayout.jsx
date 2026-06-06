import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function AppLayout({ children }) {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen flex bg-[#0F172A] text-[#dae2fd] font-sans'>
      {/* SideNavBar Component */}
      <nav className='fixed left-0 top-0 h-full w-[260px] bg-[#1E293B] border-r border-[#334155] flex flex-col py-1 z-50'>
        <div className='px-6 py-4 flex items-center gap-3'>
          <div className='w-8 h-8 rounded bg-[#ffd200] flex items-center justify-center text-[#231b00] font-bold'>
            DG
          </div>
          <div>
            <h1 className='text-lg font-bold text-[#ffd200]'>DG Advisor</h1>
            <p className='text-[10px] text-[#d1c6ab] tracking-wider uppercase'>Category Management</p>
          </div>
        </div>

        <div className='px-4 py-4'>
          <button 
            onClick={() => navigate('/scenarios')}
            className='w-full py-2 bg-[#1E293B] border border-[#334155] text-[#dae2fd] rounded-md flex items-center justify-center gap-2 hover:border-[#ffd200] hover:shadow-[0_0_4px_rgba(255,210,0,0.5)] transition-all optimize-btn'
          >
            <span className='material-symbols-outlined text-[18px]'>bolt</span>
            <span className='text-xs font-medium tracking-wider uppercase'>Optimize</span>
          </button>
        </div>

        <ul className='flex-1 mt-4'>
          <li>
            <NavLink 
              to='/' 
              end
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 border-l-4 text-xs font-medium tracking-wider uppercase transition-colors ${
                  isActive 
                    ? 'border-[#ffd200] bg-[#ffd200]/10 text-[#dae2fd] font-bold' 
                    : 'border-transparent text-[#d1c6ab] hover:bg-[#31394d] hover:text-[#dae2fd]'
                }`
              }
            >
              <span className='material-symbols-outlined'>dashboard</span>
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to='/scenarios' 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 border-l-4 text-xs font-medium tracking-wider uppercase transition-colors ${
                  isActive 
                    ? 'border-[#ffd200] bg-[#ffd200]/10 text-[#dae2fd] font-bold' 
                    : 'border-transparent text-[#d1c6ab] hover:bg-[#31394d] hover:text-[#dae2fd]'
                }`
              }
            >
              <span className='material-symbols-outlined'>compare_arrows</span>
              <span>Scenario Comparison</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to='/review' 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 border-l-4 text-xs font-medium tracking-wider uppercase transition-colors ${
                  isActive 
                    ? 'border-[#ffd200] bg-[#ffd200]/10 text-[#dae2fd] font-bold' 
                    : 'border-transparent text-[#d1c6ab] hover:bg-[#31394d] hover:text-[#dae2fd]'
                }`
              }
            >
              <span className='material-symbols-outlined'>fact_check</span>
              <span>Approval Review</span>
            </NavLink>
          </li>
          <li>
            <NavLink 
              to='/confirmation' 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 border-l-4 text-xs font-medium tracking-wider uppercase transition-colors ${
                  isActive 
                    ? 'border-[#ffd200] bg-[#ffd200]/10 text-[#dae2fd] font-bold' 
                    : 'border-transparent text-[#d1c6ab] hover:bg-[#31394d] hover:text-[#dae2fd]'
                }`
              }
            >
              <span className='material-symbols-outlined'>check_circle</span>
              <span>Confirmation</span>
            </NavLink>
          </li>
        </ul>

        <div className='mt-auto pt-4 border-t border-[#334155]'>
          <ul>
            <li>
              <a className='flex items-center gap-3 px-4 py-3 text-[#d1c6ab] hover:bg-[#31394d] hover:text-[#dae2fd] transition-colors border-l-4 border-transparent' href='#'>
                <span className='material-symbols-outlined'>settings</span>
                <span className='text-xs font-medium tracking-wider uppercase'>Settings</span>
              </a>
            </li>
            <li>
              <a className='flex items-center gap-3 px-4 py-3 text-[#d1c6ab] hover:bg-[#31394d] hover:text-[#dae2fd] transition-colors border-l-4 border-transparent' href='#'>
                <span className='material-symbols-outlined'>help</span>
                <span className='text-xs font-medium tracking-wider uppercase'>Support</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* TopAppBar & Main Content Wrapper */}
      <div className='flex-1 ml-[260px] flex flex-col min-h-screen'>
        {/* TopAppBar Component */}
        <header className='h-16 border-b border-[#334155] flex justify-between items-center px-6 w-full sticky top-0 z-40 bg-[#0F172A]'>
          <div className='flex items-center gap-8 h-full'>
            <div className='text-xl font-extrabold text-[#ffd200]'>DG Assortment Advisor</div>
            <nav className='hidden md:flex h-full gap-6'>
              <a className='h-full flex items-center text-[#ffd200] font-bold border-b-2 border-[#ffd200] px-2' href='#'>Snacks Category</a>
              <a className='h-full flex items-center text-[#d1c6ab] hover:text-[#ffd200] transition-colors px-2' href='#'>Small Town Value Cluster</a>
            </nav>
          </div>
          <div className='flex items-center gap-4'>
            <button className='text-[#dae2fd] hover:text-[#ffd200] transition-colors p-2 rounded-full hover:bg-[#31394d]'>
              <span className='material-symbols-outlined'>notifications</span>
            </button>
            <button className='text-[#dae2fd] hover:text-[#ffd200] transition-colors p-2 rounded-full hover:bg-[#31394d] flex items-center gap-2'>
              <span className='material-symbols-outlined'>account_circle</span>
              <span className='text-sm hidden lg:block text-[#d1c6ab]'>Marcus Vance</span>
            </button>
          </div>
        </header>

        {/* Main Content Canvas */}
        <main className='flex-1 p-6 max-w-[1600px] w-full mx-auto'>
          {children}
        </main>
      </div>
    </div>
  );
}
