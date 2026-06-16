import React from 'react';

export default function Sidebar() {
  return (
    <nav className='hidden md:flex w-[260px] h-screen fixed left-0 top-0 bg-inverse-surface shadow-md flex-col py-6 z-50 bg-[#213145] text-white'>
      {/* Header */}
      <div className='px-6 mb-8 flex items-center gap-3'>
        <div className='w-8 h-8 rounded bg-primary-container flex items-center justify-center shrink-0 bg-[#ffd200]'>
          <span className='material-symbols-outlined text-on-primary-container text-[20px] text-[#705b00]' data-weight='fill'>storefront</span>
        </div>
        <div>
          <h1 className='text-headline-md font-headline-md font-black text-primary-container leading-tight tracking-tight text-[#ffd200] text-lg font-bold'>DG Assortment Advisor</h1>
          <p class='text-[10px] text-surface-dim uppercase tracking-wider font-semibold opacity-80 mt-1 text-[#cbdbf5]'>Retail Management</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className='flex-1 flex flex-col gap-1 w-full'>
        {/* Active Tab */}
        <a className='flex items-center gap-3 px-4 py-3 bg-secondary-container text-on-secondary-container rounded-lg mx-2 border-l-4 border-primary-container shadow-sm transition-transform duration-200 active:scale-95 bg-[#dae2fd] text-[#5c647a] border-[#ffd200]' href='#'>
          <span className='material-symbols-outlined text-primary-container text-[#ffd200]' data-icon='dashboard'>dashboard</span>
          <span className='text-label-md font-label-md font-bold text-on-surface text-[#0b1c30]'>Dashboard</span>
        </a>
        {/* Inactive Tabs */}
        <a className='flex items-center gap-3 px-4 py-3 text-on-secondary-container/70 hover:text-on-secondary-container mx-2 hover:bg-surface-variant/20 transition-colors duration-200 active:scale-95 rounded-lg border-l-4 border-transparent text-[#dae2fd]/70 hover:text-[#dae2fd]' href='#'>
          <span className='material-symbols-outlined' data-icon='inventory_2'>inventory_2</span>
          <span className='text-label-md font-label-md'>SKU Performance</span>
        </a>
        <a className='flex items-center gap-3 px-4 py-3 text-on-secondary-container/70 hover:text-on-secondary-container mx-2 hover:bg-surface-variant/20 transition-colors duration-200 active:scale-95 rounded-lg border-l-4 border-transparent text-[#dae2fd]/70 hover:text-[#dae2fd]' href='#'>
          <span className='material-symbols-outlined' data-icon='analytics'>analytics</span>
          <span className='text-label-md font-label-md'>Scenario Modeling</span>
        </a>
        <a className='flex items-center gap-3 px-4 py-3 text-on-secondary-container/70 hover:text-on-secondary-container mx-2 hover:bg-surface-variant/20 transition-colors duration-200 active:scale-95 rounded-lg border-l-4 border-transparent text-[#dae2fd]/70 hover:text-[#dae2fd]' href='#'>
          <span className='material-symbols-outlined' data-icon='history'>history</span>
          <span className='text-label-md font-label-md'>History</span>
        </a>
        <a className='flex items-center gap-3 px-4 py-3 text-on-secondary-container/70 hover:text-on-secondary-container mx-2 hover:bg-surface-variant/20 transition-colors duration-200 active:scale-95 rounded-lg border-l-4 border-transparent text-[#dae2fd]/70 hover:text-[#dae2fd]' href='#'>
          <span className='material-symbols-outlined' data-icon='settings'>settings</span>
          <span className='text-label-md font-label-md'>Settings</span>
        </a>
      </div>

      {/* Footer / User */}
      <div className='mt-auto flex flex-col gap-1 w-full border-t border-surface-dim/20 pt-4 border-[#cbdbf5]/20'>
        <a className='flex items-center gap-3 px-4 py-3 text-on-secondary-container/70 hover:text-on-secondary-container mx-2 hover:bg-surface-variant/20 transition-colors duration-200 active:scale-95 rounded-lg border-l-4 border-transparent text-[#dae2fd]/70 hover:text-[#dae2fd]' href='#'>
          <span className='material-symbols-outlined' data-icon='help'>help</span>
          <span className='text-label-md font-label-md'>Help Center</span>
        </a>
        <div className='flex items-center gap-3 px-4 py-3 mx-2 mt-2'>
          <div className='w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center shrink-0 border border-outline-variant overflow-hidden bg-[#d3e4fe] border-[#d1c6ab]'>
            <img alt='Jane Doe User Profile Avatar' className='w-full h-full object-cover' src='https://lh3.googleusercontent.com/aida-public/AB6AXuBMuzrGSI_IPHQa85_xpfpO7ZJhktgkMiMD_ZrR_A88KFRps7ENHAl5SS8jRSfosBr3H28-OFNpncW2-s6tpfLjEm6VKcOln2EkWRjrk3OaB1eal6k-5-neUXjq9nIuDPBlkbNr-LCrFxY7l9QJX4gS3hbdCCnoBjbMhovNec_-Ouf6JcGh7zavuQolNNeiqlzj-ONRUqLNPEGwQHj17ocMU_Vgwe6IPK_ce-qGnSlGu-ZxC_nThnzbR9v9VA96qDxqPwl-d7yJMAY' />
          </div>
          <div className='flex flex-col'>
            <span className='text-label-md font-label-md text-surface-container-lowest text-white font-semibold text-sm'>Jane Doe</span>
            <span className='text-[10px] text-surface-dim text-[#cbdbf5]'>Category Manager</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
