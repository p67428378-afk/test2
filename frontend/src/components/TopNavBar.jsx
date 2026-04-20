import React from 'react';

const TopNavBar = () => {
  return (
    <header className='flex justify-between items-center h-20 px-12 ml-64 w-[calc(100%-16rem)] bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl docked full-width top-0 sticky z-40 shadow-[0_20px_40px_rgba(25,28,29,0.06)]'>
      <div className='flex items-center gap-8'>
        <div className='relative'>
          <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'>search</span>
          <input className='pl-10 pr-4 py-2 bg-surface-container-highest border-none rounded-lg text-sm w-80 focus:ring-2 focus:ring-primary/20' placeholder='Search holdings or risk factors...' type='text'/>
        </div>
        <nav className='flex gap-6'>
          <a className='text-slate-900 dark:text-slate-50 border-b-2 border-slate-900 pb-1 text-sm font-medium' href='#'>Exposure</a>
          <a className='text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-all text-sm font-medium' href='#'>Limits</a>
          <a className='text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-all text-sm font-medium' href='#'>History</a>
        </nav>
      </div>
      <div className='flex items-center gap-4'>
        <div className='flex gap-2'>
          <button className='p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors'>
            <span className='material-symbols-outlined'>notifications</span>
          </button>
          <button className='p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors'>
            <span className='material-symbols-outlined'>help_outline</span>
          </button>
        </div>
        <div className='h-8 w-[1px] bg-slate-200 mx-2'></div>
        <button className='px-4 py-2 border border-outline-variant/20 text-primary text-sm font-semibold hover:bg-surface-container transition-all'>Export Data</button>
        <button className='px-4 py-2 bg-primary text-on-primary text-sm font-semibold rounded-lg hover:bg-primary-container transition-all'>Execute Trade</button>
        <div className='ml-2 w-10 h-10 rounded-full overflow-hidden bg-slate-200'>
          <img className='w-full h-full object-cover' src='https://lh3.googleusercontent.com/aida-public/AB6AXuCumsCtWLW9bN0cu1EQvyBUMBN68OFBtjaghfng7go516GOgBVoUo2KMjKY6E2YvNS3LU9uS1TV1ngo2mJjMomS0lk-OPdkEx99hU2aNfTAxt2eAzmIKCpuZaTClxZaa2A6eVFF3qhl4oFWovXq2CyhlHm88PXYeWZr_SqB-0BqOYd_I4lRlaQZBe1yyDxIjrP59cXCFASFIk9F31o3t2sknaYDZdJ53gJlml9ZojzNfCno90NaR7U4HaHvbouMOVvd6s2Yd9lj4j55' alt='professional headshot of a chief risk officer in a dark suit with a neutral background and professional studio lighting' />
        </div>
      </div>
    </header>
  );
};

export default TopNavBar;
