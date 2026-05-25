
import React from 'react';

const Header = () => {
  return (
    <header className='bg-slate-50 dark:bg-slate-950 flex justify-between items-center w-full px-8 py-4 max-w-[1920px] mx-auto font-manrope tracking-tight sticky top-0 z-50'>
      <div className='flex items-center gap-12'>
        <span className='text-xl font-black tracking-widest uppercase text-blue-900 dark:text-blue-50'>Sovereign Ledger</span>
        <nav className='hidden md:flex gap-8'>
          <a className='text-slate-500 dark:text-slate-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors' href='#'>Dashboard</a>
          <a className='text-blue-900 dark:text-blue-400 border-b-2 border-blue-900 dark:border-blue-400 font-bold pb-1' href='#'>Entity Search</a>
          <a className='text-slate-500 dark:text-slate-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors' href='#'>Audit Vault</a>
          <a className='text-slate-500 dark:text-slate-400 font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors' href='#'>Reporting</a>
        </nav>
      </div>
      <div className='flex items-center gap-6'>
        <span className='material-symbols-outlined text-slate-500 cursor-pointer'>notifications</span>
        <span className='material-symbols-outlined text-slate-500 cursor-pointer'>settings</span>
        <img alt='Chief Compliance Officer Avatar' className='w-8 h-8 rounded-full bg-surface-container-high' src='https://lh3.googleusercontent.com/aida-public/AB6AXuDI3AXqxtGovF5OAofFhclT-JTtm-MXvpn75FFPINPdLlgmj_ZzKzN7MXd_9L9rXZ9fF4Pzko8N1xv_Gihok5dWhsQIyU2T1EOEfUC3SVlnm3ZglZ-TspCW8xvsv8elWzNPCDmWnobfls1Q1adRqJc_oR5XdJF-mace0FLxmGu3OhNrDttDuxCI9ItRaJyH0EZOQyzODos_1Nd83tgsYfmcVmX_AFtkQPlUELZUvZO17KjR5nsMuSjZb0WF3PjfQBaj_ZhJVuf5qgo'/>
      </div>
    </header>
  );
};

export default Header;
