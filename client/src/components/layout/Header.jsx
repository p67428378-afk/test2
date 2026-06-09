import React from 'react';

export default function Header() {
  return (
    <header className='bg-surface-container shadow-sm docked full-width top-0 h-[64px] flex justify-between items-center px-padding-container w-full max-w-full z-50'>
      <div className='flex items-center gap-3'>
        <span className='material-symbols-outlined text-primary font-display-sm text-display-sm'>calculate</span>
        <span className='font-display-sm text-display-sm font-bold text-on-surface'>Simple Calculator</span>
      </div>
      <div className='flex items-center gap-6'>
        <div className='hidden md:flex items-center gap-2 px-3 py-1.5 bg-surface-container-lowest rounded-full border border-outline-variant/50'>
          <span className='w-2 h-2 rounded-full bg-secondary-fixed animate-pulse'></span>
          <span className='font-label-md text-label-md text-on-surface-variant text-sm'>API Service: Connected</span>
        </div>
        <button className='w-8 h-8 rounded-full overflow-hidden border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition-all'>
          <img alt="User profile avatar" className='w-full h-full object-cover' src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPjZajmY57k-BBEeUgHqzDStegc3NuIDUThfh-hT1SX6tss92fe8S4AQ8FKFvNZHmBlFv-A4QhtIF-vV4xY3_WxR7gHbs72_cFOjOcmX9Ncj8AjNW0NK2zVSXbyC3D0qak7nU1zdN4fSMLPq8b_NAHMu9PHLRbYrryCE_6lXFRg1UjXQh1LUgx7WAX--WZiz_TUys07c7wFN_neJhqmw9tk4WRBf7zmevi0Jnwb-AWSxS_9lqEYAMTeRlIGGX6KbmG2qNmg6NFFlE" />
        </button>
      </div>
    </header>
  );
}