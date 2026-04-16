import React from 'react';

const TopNavBar = () => {
  return (
    <header className='bg-slate-50/80 backdrop-blur-xl w-full sticky top-0 z-50'>
      <div className='flex justify-between items-center px-8 py-4 w-full max-w-[1920px] mx-auto'>
        <div className='flex items-center gap-8'>
          <span className='text-2xl font-black tracking-tight text-sky-900'>The Editorial Health Portal</span>
          <div className='hidden md:flex gap-6'>
            <span className='text-sky-900 font-bold border-b-2 border-sky-900 cursor-pointer transition-all duration-300 active:opacity-70'>Policies</span>
            <span className='text-slate-500 font-medium hover:text-sky-700 transition-colors cursor-pointer'>Find Doctors</span>
            <span className='text-slate-500 font-medium hover:text-sky-700 transition-colors cursor-pointer'>Resources</span>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <div className='relative flex items-center bg-surface-container-high rounded-full px-4 py-2 w-64 group focus-within:ring-2 ring-primary'>
            <span className='material-symbols-outlined text-slate-500 text-sm'>search</span>
            <input className='bg-transparent border-none focus:ring-0 text-sm w-full font-body' placeholder='Search coverage...' type='text'/>
          </div>
          <button className='material-symbols-outlined text-slate-500 hover:text-sky-700 transition-all'>notifications</button>
          <button className='material-symbols-outlined text-slate-500 hover:text-sky-700 transition-all'>help</button>
          <div className='w-10 h-10 rounded-full overflow-hidden border border-outline-variant/20'>
            <img alt='Policy Holder Avatar' src='https://lh3.googleusercontent.com/aida-public/AB6AXuAlNPai42MYsdYKnE6SwGfKCW-OsNWCgSO90KBz1KwZ0eCgyeKBokhcDSj4Rm5l0wQLb2edcuMogzcl6iW_Jto3c-Vur2hsu40k4-NKdV-1426mLEeZVo443WA8ryVQbUW0ydjED-58K3e4SPTpDfDP1nsp6Gfu41akkqB7U22oS1uzqKJcDxH0UykinWth4MXXxC4TzOQUQ_zNQHO4gc20NiCr12cWYM7rbqhSbD-T3nG-LYwuXVNhI4SbwOtIcyzPBvKzzkA3GLlc'/>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavBar;
