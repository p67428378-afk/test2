import React from 'react';

function PolicyDashboard() {
  return (
    <div className='bg-surface text-on-surface font-body'>
      {/* TopNavBar */}
      <nav className='fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-[0_24px_40px_rgba(43,52,55,0.04)] h-16 flex justify-between items-center px-6'>
        <div className='flex items-center gap-8'>
          <span className='text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 font-headline'>Clinical Curator</span>
          <div className='hidden md:flex items-center space-x-6 text-sm'>
            <a className='text-blue-700 dark:text-blue-400 font-semibold border-b-2 border-blue-700 h-16 flex items-center' href='#'>Overview</a>
            <a className='text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors h-16 flex items-center px-2' href='#'>Coverage</a>
            <a className='text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors h-16 flex items-center px-2' href='#'>Documents</a>
            <a className='text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors h-16 flex items-center px-2' href='#'>Billing</a>
          </div>
        </div>
        <div className='flex items-center space-x-4'>
          <div className='relative flex items-center bg-surface-container rounded-full px-4 py-1.5'>
            <span className='material-symbols-outlined text-outline text-lg' data-icon='search'>search</span>
            <input className='bg-transparent border-none focus:ring-0 text-sm ml-2 w-48' placeholder='Search claims or providers...' type='text'/>
          </div>
          <button className='p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors'>
            <span className='material-symbols-outlined' data-icon='notifications'>notifications</span>
          </button>
          <button className='p-2 text-on-surface-variant hover:bg-surface-container-high rounded-full transition-colors'>
            <span className='material-symbols-outlined' data-icon='help'>help</span>
          </button>
          <div className='h-8 w-8 rounded-full bg-primary-container flex items-center justify-center overflow-hidden'>
            <img alt='User profile avatar' data-alt='close-up portrait of a professional man in his 40s with a kind expression and neutral background' src='https://lh3.googleusercontent.com/aida-public/AB6AXuC2m-RL1dJQH9TxMRP4Ml7_QRyLPf6SWeLpBHpyyWFkuElpWBS58p5OdxB2MrtE590bJZLKyFzIqkdWA_2fiDqSmVgvgqnnkVFNW_6YcOwzICsBQVF96UXIBdc3P60GFUbWDLjJEL2OnlK7zBIM3-o51EY3su4Za8oj-dFTRXSv6iTcN8IcgKIvigWV0AGzRnOt4y75r8Q5PJhDpW08UVAPxQrOh90ZOnYZwwH-_auLQj42Kw4l6eNtnKEGS4aYsd9XTlyURRWT8IgJ'/>
          </div>
        </div>
      </nav>
      {/* SideNavBar */}
      <aside className='fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-slate-50 dark:bg-slate-950 flex flex-col p-4 space-y-2 border-r border-transparent'>
        <div className='mb-6 px-2'>
          <p className='text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-4'>Main Navigation</p>
          <div className='space-y-1'>
            <a className='flex items-center space-x-3 p-3 bg-white dark:bg-slate-900 text-blue-700 dark:text-blue-400 shadow-sm rounded-lg transition-all duration-200' href='#'>
              <span className='material-symbols-outlined' data-icon='dashboard'>dashboard</span>
              <span className='text-sm font-medium'>Overview</span>
            </a>
            <a className='flex items-center space-x-3 p-3 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-200' href='#'>
              <span className='material-symbols-outlined' data-icon='verified_user'>verified_user</span>
              <span className='text-sm font-medium'>Coverage</span>
            </a>
            <a className='flex items-center space-x-3 p-3 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-200' href='#'>
              <span className='material-symbols-outlined' data-icon='description'>description</span>
              <span className='text-sm font-medium'>Documents</span>
            </a>
            <a className='flex items-center space-x-3 p-3 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-200' href='#'>
              <span className='material-symbols-outlined' data-icon='payments'>payments</span>
              <span className='text-sm font-medium'>Billing</span>
            </a>
            <a className='flex items-center space-x-3 p-3 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-200' href='#'>
              <span className='material-symbols-outlined' data-icon='contact_support'>contact_support</span>
              <span className='text-sm font-medium'>Support</span>
            </a>
          </div>
        </div>
        <div className='mt-auto px-2 pb-4'>
          <div className='space-y-1'>
            <a className='flex items-center space-x-3 p-3 text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 rounded-lg transition-all duration-200' href='#'>
              <span className='material-symbols-outlined' data-icon='settings'>settings</span>
              <span className='text-sm font-medium'>Settings</span>
            </a>
            <a className='flex items-center space-x-3 p-3 text-error hover:bg-error/10 rounded-lg transition-all duration-200' href='#'>
              <span className='material-symbols-outlined' data-icon='logout'>logout</span>
              <span className='text-sm font-medium'>Sign Out</span>
            </a>
          </div>
        </div>
      </aside>
      {/* Main Content Canvas */}
      <main className='ml-64 pt-24 px-10 pb-12 min-h-screen'>
        <header className='mb-10'>
          <h1 className='text-3xl font-extrabold text-on-surface font-headline -tracking-tight'>Elite Platinum Plus</h1>
          <p className='text-on-surface-variant mt-1'>Policy ID: CCP-882910-JD</p>
        </header>
        <div className='grid grid-cols-12 gap-6'>
          {/* Left/Center Column: Policy Details */}
          <div className='col-span-12 lg:col-span-7 space-y-6'>
            {/* Bento Grid Detail Cards */}
            <div className='grid grid-cols-2 gap-6'>
              <div className='bg-surface-container-lowest p-6 rounded-xl shadow-[0_24px_40px_rgba(43,52,55,0.04)]'>
                <div className='flex items-center space-x-3 mb-4'>
                  <span className='material-symbols-outlined text-primary' data-icon='calendar_today'>calendar_today</span>
                  <h3 className='font-bold text-sm text-on-surface-variant uppercase tracking-wider'>Coverage Period</h3>
                </div>
                <p className='text-2xl font-bold text-on-surface'>Jan 01, 2024</p>
                <p className='text-sm text-on-surface-variant'>to Dec 31, 2024</p>
              </div>
              <div className='bg-surface-container-lowest p-6 rounded-xl shadow-[0_24px_40px_rgba(43,52,55,0.04)]'>
                <div className='flex items-center space-x-3 mb-4'>
                  <span className='material-symbols-outlined text-primary' data-icon='account_balance_wallet'>account_balance_wallet</span>
                  <h3 className='font-bold text-sm text-on-surface-variant uppercase tracking-wider'>Monthly Premium</h3>
                </div>
                <p className='text-2xl font-bold text-on-surface'>$450.00</p>
                <p className='text-sm text-on-surface-variant'>Next bill due: <span className='font-semibold text-primary'>Mar 01, 2024</span></p>
              </div>
            </div>
            {/* Personal Info & Address */}
            <div className='bg-surface-container-low p-6 rounded-xl'>
              <div className='flex justify-between items-start'>
                <div>
                  <h3 className='font-bold text-sm text-on-surface-variant uppercase tracking-wider mb-4'>Primary Policyholder</h3>
                  <div className='flex items-center space-x-4'>
                    <div className='bg-white p-3 rounded-lg'>
                      <span className='material-symbols-outlined text-primary' data-icon='person'>person</span>
                    </div>
                    <div>
                      <p className='text-lg font-bold text-on-surface'>John Doe</p>
                      <p className='text-sm text-on-surface-variant'>123 Health Ave, Wellness City</p>
                    </div>
                  </div>
                </div>
                <button className='text-primary text-sm font-bold flex items-center gap-1 hover:underline'>
                  Edit Profile <span className='material-symbols-outlined text-sm' data-icon='open_in_new'>open_in_new</span>
                </button>
              </div>
            </div>
            {/* Covered Medical Services */}
            <div className='bg-surface-container-lowest p-8 rounded-xl shadow-[0_24px_40px_rgba(43,52,55,0.04)]'>
              <h3 className='font-bold text-lg mb-6'>Covered Medical Services</h3>
              <div className='grid grid-cols-4 gap-4'>
                <div className='bg-surface-container-low p-4 rounded-xl text-center group hover:bg-primary-container transition-colors'>
                  <span className='material-symbols-outlined text-3xl text-primary mb-2' data-icon='hospital'>local_hospital</span>
                  <p className='text-sm font-bold'>Inpatient</p>
                  <p className='text-xs text-on-surface-variant mt-1'>100% Covered</p>
                </div>
                <div className='bg-surface-container-low p-4 rounded-xl text-center group hover:bg-primary-container transition-colors'>
                  <span className='material-symbols-outlined text-3xl text-primary mb-2' data-icon='medical_services'>medical_services</span>
                  <p className='text-sm font-bold'>Outpatient</p>
                  <p className='text-xs text-on-surface-variant mt-1'>$20 Co-pay</p>
                </div>
                <div className='bg-surface-container-low p-4 rounded-xl text-center group hover:bg-primary-container transition-colors'>
                  <span className='material-symbols-outlined text-3xl text-primary mb-2' data-icon='emergency'>emergency</span>
                  <p className='text-sm font-bold'>Emergency</p>
                  <p className='text-xs text-on-surface-variant mt-1'>Fixed $150</p>
                </div>
                <div className='bg-surface-container-low p-4 rounded-xl text-center group hover:bg-primary-container transition-colors'>
                  <span className='material-symbols-outlined text-3xl text-primary mb-2' data-icon='medication'>medication</span>
                  <p className='text-sm font-bold'>Pharmacy</p>
                  <p className='text-xs text-on-surface-variant mt-1'>Tier 1 &amp; 2</p>
                </div>
              </div>
            </div>
          </div>
          {/* Center/Right Column: Update Coverage */}
          <div className='col-span-12 lg:col-span-5 space-y-6'>
            <div className='bg-white p-8 rounded-xl shadow-[0_24px_40px_rgba(43,52,55,0.04)] h-full flex flex-col'>
              <div className='mb-8'>
                <h2 className='text-xl font-bold mb-2'>Adjust Coverage Level</h2>
                <p className='text-sm text-on-surface-variant'>Customize your plan to match your current health needs.</p>
              </div>
              <div className='space-y-6 flex-grow'>
                {/* Dental Select */}
                <div>
                  <label className='block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3'>Dental Coverage</label>
                  <div className='relative'>
                    <select className='w-full bg-surface-container-low border-b-2 border-primary focus:ring-0 rounded-t-lg py-3 px-4 appearance-none font-medium'>
                      <option selected='' value='advanced'>Advanced (Current)</option>
                      <option value='premier'>Premier (+ $45/mo)</option>
                      <option value='basic'>Basic (- $20/mo)</option>
                    </select>
                    <span className='material-symbols-outlined absolute right-4 top-3 text-outline pointer-events-none' data-icon='expand_more'>expand_more</span>
                  </div>
                </div>
                {/* Vision Select */}
                <div>
                  <label className='block text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-3'>Vision Coverage</label>
                  <div className='relative'>
                    <select className='w-full bg-surface-container-low border-b-2 border-primary focus:ring-0 rounded-t-lg py-3 px-4 appearance-none font-medium'>
                      <option selected='' value='premier'>Premier (Current)</option>
                      <option value='standard'>Standard (- $10/mo)</option>
                    </select>
                    <span className='material-symbols-outlined absolute right-4 top-3 text-outline pointer-events-none' data-icon='expand_more'>expand_more</span>
                  </div>
                </div>
                {/* Mental Health Info */}
                <div className='flex items-center justify-between p-4 bg-primary-container/30 rounded-xl'>
                  <div className='flex items-center gap-3'>
                    <span className='material-symbols-outlined text-primary' data-icon='psychology'>psychology</span>
                    <span className='text-sm font-bold'>Mental Health Inclusion</span>
                  </div>
                  <span className='text-xs font-bold px-2 py-1 bg-primary text-white rounded'>Included</span>
                </div>
                {/* Effective Date Info */}
                <div className='flex gap-3 p-4 bg-surface-container-low rounded-xl'>
                  <span className='material-symbols-outlined text-on-surface-variant' data-icon='info'>info</span>
                  <p className='text-sm leading-relaxed text-on-surface-variant'>
                    Changes will take effect on your next billing cycle <span className='font-bold text-on-surface'>(Apr 01, 2024)</span>. Pro-rated adjustments will be reflected in your next invoice.
                  </p>
                </div>
              </div>
              <div className='mt-10 space-y-4'>
                <button className='w-full premium-gradient text-white font-bold py-4 rounded shadow-lg hover:opacity-90 active:scale-95 transition-all'>
                  Save Changes
                </button>
                <div className='pt-6 border-t border-surface-container-high flex justify-between items-center'>
                  <p className='text-xs text-on-surface-variant font-medium'>Need to pause your plan?</p>
                  {/* Cancel Action */}
                  <button className='text-error font-bold text-sm py-2 px-4 hover:bg-error/10 rounded transition-colors flex items-center gap-2'>
                    <span className='material-symbols-outlined text-lg' data-icon='cancel'>cancel</span>
                    Cancel Policy
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Confirmation Dialog Placeholder (Semi-transparent Backdrop) */}
        {/* To show as active, remove 'hidden' class */}
        <div className='hidden fixed inset-0 z-[100] flex items-center justify-center p-6 glass-panel'>
          <div className='bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden'>
            <div className='p-6 text-center'>
              <div className='w-16 h-16 bg-error-container/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='material-symbols-outlined text-error text-3xl' data-icon='warning'>warning</span>
              </div>
              <h3 className='text-xl font-bold mb-2'>Cancel Your Policy?</h3>
              <p className='text-on-surface-variant text-sm mb-6'>This action cannot be undone. You will lose coverage for John Doe starting Apr 01, 2024.</p>
              <div className='flex gap-4'>
                <button className='flex-1 py-3 px-4 bg-surface-container-high font-bold rounded hover:bg-surface-container-highest transition-colors'>Keep Coverage</button>
                <button className='flex-1 py-3 px-4 bg-error text-white font-bold rounded hover:bg-error/90 transition-colors'>Confirm Cancellation</button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Floating Action Button (Only on Mobile-like contexts as per rules, but included for Dashboard focus) */}
      <button className='fixed bottom-8 right-8 w-14 h-14 premium-gradient text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform md:hidden'>
        <span className='material-symbols-outlined' data-icon='add'>add</span>
      </button>
    </div>
  );
}

export default PolicyDashboard;