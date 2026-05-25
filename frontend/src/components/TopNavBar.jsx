import React from 'react';

const TopNavBar = () => {
  return (
    <nav className='fixed top-0 w-full z-50 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm flex justify-between items-center px-10 h-16 w-full'>
      <div className='flex items-center gap-8'>
        <span className='text-xl font-bold tracking-tighter text-blue-900 dark:text-blue-100'>The Digital Vault</span>
        <div className='hidden md:flex items-center gap-6 font-manrope font-semibold tracking-tight'>
          <a className='text-blue-900 dark:text-blue-400 border-b-2 border-blue-900 dark:border-blue-400 pb-1' href='#'>Onboarding</a>
          <a className='text-slate-500 dark:text-slate-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-200' href='#'>Documents</a>
          <a className='text-slate-500 dark:text-slate-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors duration-200' href='#'>History</a>
        </div>
      </div>
      <div className='flex items-center gap-4'>
        <div className='relative w-64'>
          <input className='w-full bg-surface-container border-none rounded-xl px-4 py-1.5 text-sm focus:ring-2 focus:ring-primary/20' placeholder='Search entity...' type='text'/>
        </div>
        <button className='p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors'>
          <span className='material-symbols-outlined'>notifications</span>
        </button>
        <button className='p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors'>
          <span className='material-symbols-outlined'>settings</span>
        </button>
        <div className='flex items-center gap-3 ml-2 pl-4 border-l border-surface-variant'>
          <div className='text-right hidden sm:block'>
            <p className='text-xs font-bold text-on-surface'>Alex Thompson</p>
            <p className='text-[10px] text-on-surface-variant uppercase tracking-wider'>Chief Compliance Officer</p>
          </div>
          <img alt='Chief Compliance Officer Avatar' className='w-10 h-10 rounded-full object-cover ring-2 ring-primary/10' src='https://lh3.googleusercontent.com/aida-public/AB6AXuD-lSAup3K6DKKwq5bGvaJqDcOGMLpVwQCnxA-0T3TxHn2o7e4-dFJFtM9ZD1bM2XovFb2EhDcjM0O4Oe75YSe9kiNAa1A044eQ3nOLAYZzowld_3ZmM8YN2GqrWCyAzuHSy2T-B8oYorEhR2rcw1kembne4uK0hS9i3N1O9aC8McJCXpnCniod5IwuMQ9mOXRZJSxc_O-OdaB8KMPSul03pu9GP9iasALyVUvtp9E-OO5sIplW9HlK_Ary3RA3AuGQPjAmKwtXSYk'/>
        </div>
      </div>
    </nav>
  );
};

export default TopNavBar;
