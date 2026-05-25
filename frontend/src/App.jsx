
import React from 'react';

function App() {
  return (
    <div className='bg-background text-on-surface'>
      <header className='bg-white/70 dark:bg-slate-900/70 backdrop-blur-md sticky top-0 z-50 flex justify-between items-center px-8 h-16 w-full bg-surface-container-low'>
        <div className='flex items-center gap-8'>
          <span className='text-xl font-bold tracking-tight text-blue-900 dark:text-blue-200'>Clarified Guardian Portal</span>
          <nav className='hidden md:flex gap-6 items-center h-full'>
            <a className='text-slate-500 dark:text-slate-400 hover:text-blue-900 transition-colors' href='#'>Dashboard</a>
            <a className='text-slate-500 dark:text-slate-400 hover:text-blue-900 transition-colors' href='#'>Claims</a>
            <a className='text-slate-500 dark:text-slate-400 hover:text-blue-900 transition-colors' href='#'>Providers</a>
            <a className='text-slate-500 dark:text-slate-400 hover:text-blue-900 transition-colors' href='#'>Documents</a>
          </nav>
        </div>
        <div className='flex items-center gap-4'>
          <div className='relative hidden lg:block'>
            <span className='absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-sm'>search</span>
            <input className='pl-10 pr-4 py-1.5 bg-surface-container-high border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary-container' placeholder='Search policy details...' type='text' />
          </div>
          <button className='p-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors rounded-full relative'>
            <span className='material-symbols-outlined text-on-surface-variant'>notifications</span>
            <span className='absolute top-2 right-2 w-2 h-2 bg-error rounded-full'></span>
          </button>
          <button className='p-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors rounded-full'>
            <span className='material-symbols-outlined text-on-surface-variant'>help_outline</span>
          </button>
          <div className='h-8 w-8 rounded-full overflow-hidden ml-2 ring-2 ring-primary-container/20'>
            <img alt='User profile' src='https://lh3.googleusercontent.com/aida-public/AB6AXuCJuoTu_G1-WmpnbRi6f3L199F1Zu2aUGmz0ZtRrBzyxA6c3PNtXDFStNdjWtdmTXIIOLDyjuiXdpshXJZCcU3vUcjam9SBDl0VWDdeEuh4inzRn3wXsOn51JpERypQGshHeT350iosYzO1Dln246_gAPMnxnsXdw-fvm7nyt8HTNfHhAtWSUsp0gTs8XOnYag_UoNKdkebvUP7cTrDbgAJXpeFeh5JqwSpWdvcxyfpUu9VVkccCFcYn4XBNPgRQA6iSxqrX_HirdGR' />
          </div>
        </div>
      </header>
      <div className='flex'>
        <aside className='fixed left-0 top-16 h-[calc(100vh-64px)] w-64 flex flex-col py-6 bg-slate-50 dark:bg-slate-950 bg-surface-container-highest'>
          <div className='px-6 mb-8'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='h-10 w-10 bg-primary-container rounded-lg flex items-center justify-center'>
                <span className='material-symbols-outlined text-white'>security</span>
              </div>
              <div>
                <p className='text-xs font-bold text-blue-800 uppercase tracking-widest'>Active Policy</p>
                <p className='text-sm font-semibold text-on-surface'>#POL-882910</p>
              </div>
            </div>
          </div>
          <nav className='flex-1 space-y-1'>
            <a className='text-slate-600 dark:text-slate-400 px-6 py-3 flex items-center gap-3 hover:text-blue-700 dark:hover:text-blue-300 transition-all' href='#'>
              <span className='material-symbols-outlined'>dashboard</span>
              <span className='text-sm font-medium'>Overview</span>
            </a>
            <a className='bg-white dark:bg-slate-900 text-blue-800 dark:text-blue-300 font-semibold rounded-l-lg shadow-sm px-6 py-3 flex items-center gap-3 translate-x-1 transition-transform' href='#'>
              <span className='material-symbols-outlined'>group</span>
              <span className='text-sm'>Beneficiaries</span>
            </a>
            <a className='text-slate-600 dark:text-slate-400 px-6 py-3 flex items-center gap-3 hover:text-blue-700 dark:hover:text-blue-300 transition-all' href='#'>
              <span className='material-symbols-outlined'>security</span>
              <span className='text-sm font-medium'>Coverage Details</span>
            </a>
            <a className='text-slate-600 dark:text-slate-400 px-6 py-3 flex items-center gap-3 hover:text-blue-700 dark:hover:text-blue-300 transition-all' href='#'>
              <span className='material-symbols-outlined'>payments</span>
              <span className='text-sm font-medium'>Premiums</span>
            </a>
            <a className='text-slate-600 dark:text-slate-400 px-6 py-3 flex items-center gap-3 hover:text-blue-700 dark:hover:text-blue-300 transition-all' href='#'>
              <span className='material-symbols-outlined'>edit_note</span>
              <span className='text-sm font-medium'>Policy Updates</span>
            </a>
          </nav>
          <div className='mt-auto px-6 space-y-2'>
            <button className='w-full flex items-center gap-3 px-4 py-3 bg-blue-900 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 transition-colors'>
              <span className='material-symbols-outlined text-sm'>contact_support</span>
              Support Center
            </button>
            <a className='flex items-center gap-3 px-4 py-3 text-error hover:bg-error-container/10 transition-colors rounded-lg text-xs font-bold uppercase tracking-tighter' href='#'>
              <span className='material-symbols-outlined text-sm'>cancel</span>
              Cancellation Request
            </a>
          </div>
        </aside>
        <main className='ml-64 flex-1 p-8 min-h-screen'>
          <div className='max-w-7xl mx-auto space-y-8'>
            <div className='flex justify-between items-end'>
              <div>
                <h1 className='text-3xl font-extrabold text-blue-900 tracking-tight mb-2'>Policy Overview</h1>
                <p className='text-on-surface-variant text-sm'>Manage your health coverage and primary beneficiaries</p>
              </div>
              <div className='flex gap-3'>
                <button className='px-5 py-2.5 rounded-lg border border-outline-variant text-sm font-semibold hover:bg-surface-container transition-colors'>Download Policy PDF</button>
                <button className='px-5 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold shadow-sm hover:opacity-90 transition-opacity'>Contact Advisor</button>
              </div>
            </div>
            <div className='grid grid-cols-12 gap-6'>
              <div className='col-span-12 lg:col-span-8 bg-gradient-to-br from-primary to-primary-container p-8 rounded-full rounded-bl-none shadow-xl text-white relative overflow-hidden flex flex-col justify-between min-h-[320px]'>
                <div className='relative z-10 flex justify-between items-start'>
                  <div>
                    <span className='px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold uppercase tracking-widest'>Active Plan</span>
                    <h2 className='text-4xl font-extrabold mt-4 mb-2'>Gold Shield Premium</h2>
                    <p className='text-primary-fixed opacity-90 max-w-md'>Comprehensive medical and dental coverage with zero deductibles for primary care visits.</p>
                  </div>
                  <div className='text-right'>
                    <p className='text-xs uppercase tracking-widest text-primary-fixed mb-1'>Monthly Premium</p>
                    <p className='text-5xl font-black tracking-tighter'>$450<span className='text-xl font-medium'>/mo</span></p>
                  </div>
                </div>
                <div className='relative z-10 grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/10'>
                  <div>
                    <p className='text-[10px] uppercase font-bold text-primary-fixed-dim'>Effective Date</p>
                    <p className='text-lg font-bold'>Jan 01, 2024</p>
                  </div>
                  <div>
                    <p className='text-[10px] uppercase font-bold text-primary-fixed-dim'>Renewal Date</p>
                    <p className='text-lg font-bold'>Jan 01, 2025</p>
                  </div>
                  <div>
                    <p className='text-[10px] uppercase font-bold text-primary-fixed-dim'>Max Out-of-Pocket</p>
                    <p className='text-lg font-bold'>$1,500.00</p>
                  </div>
                </div>
                <div className='absolute -right-20 -bottom-20 w-80 h-80 bg-secondary rounded-full blur-[100px] opacity-20'></div>
                <div className='absolute right-10 top-10 w-40 h-40 bg-white/10 rounded-full blur-[60px]'></div>
              </div>
              <div className='col-span-12 lg:col-span-4 bg-surface-container-low rounded-xl p-6 flex flex-col'>
                <div className='flex justify-between items-center mb-6'>
                  <h3 className='text-lg font-bold text-blue-900'>Beneficiaries</h3>
                  <button className='text-primary text-xs font-bold hover:underline'>Manage All</button>
                </div>
                <div className='space-y-4'>
                  <div className='flex items-center gap-4 bg-surface-container-lowest p-3 rounded-lg border-l-4 border-secondary'>
                    <img alt='Sarah J.' className='w-10 h-10 rounded-full object-cover' src='https://lh3.googleusercontent.com/aida-public/AB6AXuAeYxaAB3Xbjk8pkyc4Mfx6p1g4abqNptu4hLTdb7eKzOCpaPFU3jjAkgLETWBWvOzrKuL1gFcabvPT9xscdbjjHZmdZ3q_Sr_x-p1LEnp_kXAlBKgrtdxcgSnxdT_L_BUvSPZxKYrU-z4xfq-1olQPcoideNVrLyPIXmc1M2v6879M1ZA2YXiTfj58q0VLwZQj3DZf2L3SkMOqN7Ro4T_SsPExJeRXFNlboXTG-MA0-ayJ_kFO0HsZBfOdjVvGrV9qDpYqOG9PuHuv' />
                    <div>
                      <p className='text-sm font-bold'>Sarah Jenkins</p>
                      <p className='text-xs text-on-surface-variant'>Spouse • 50% Share</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-4 bg-surface-container-lowest p-3 rounded-lg'>
                    <img alt='Leo J.' className='w-10 h-10 rounded-full object-cover' src='https://lh3.googleusercontent.com/aida-public/AB6AXuCfAoHrhXsy9-V5AC4j2jY6aEPf7c6sTLOIRsbeAQ-RoloiZWvyS56RWSSGw8AFQ16dRVmoYY08nXDUXt_hODzKQmqTimSCb8--dNYZK_w4Flyyq7bzvlHKmR7XD5AwVU4SP90lO5uCBdXSLmRP_H2eVRfYcYC1YBi9Vx6bra1RjO2RMU0ufi0MCmUVXgbdgpZDQk1VCH02FdfRM5BuAX_y0AnivHVRc0sVoIygXnxkplqvQgcA0Gx7sLRHtPkiO9JVEchlURh-bovQ' />
                    <div>
                      <p className='text-sm font-bold'>Leo Jenkins</p>
                      <p className='text-xs text-on-surface-variant'>Child • 25% Share</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-4 bg-surface-container-lowest p-3 rounded-lg'>
                    <img alt='Maya J.' className='w-10 h-10 rounded-full object-cover' src='https://lh3.googleusercontent.com/aida-public/AB6AXuCbGg_u4LAus72fuQa4-iBFrEFJaJwtAsz6bZuVxDowxE6gTdt_BHNr3GmfegdtpnHgRx6Gztfbg-5ghVVspZvH9SeaEUK5mQRtYNnaVNTwRN00IXyAOaMJ9eXJSsKC0SOisPjCKTpXshff5aU-CnlLLBnGAxYXaJI98VYxpEhXllsivrYidbU2UTf5YjZdCOCFz0fQmHaSaKIa9swNESuzNcnTmvoGuY5bZv4WHMUejN7tixgzS4_wSUGIs8GIXMGExP_yQx33odCZ' />
                    <div>
                      <p className='text-sm font-bold'>Maya Jenkins</p>
                      <p className='text-xs text-on-surface-variant'>Child • 25% Share</p>
                    </div>
                  </div>
                </div>
                <button className='mt-auto w-full py-3 border-2 border-dashed border-outline-variant rounded-xl text-xs font-bold text-outline hover:bg-white transition-colors flex items-center justify-center gap-2'>
                  <span className='material-symbols-outlined text-sm'>person_add</span>
                  Add Beneficiary
                </button>
              </div>
              <div className='col-span-12 lg:col-span-7 bg-surface-container-low rounded-xl p-8'>
                <div className='flex items-center gap-3 mb-8'>
                  <span className='material-symbols-outlined text-secondary'>tune</span>
                  <h3 className='text-xl font-bold text-blue-900'>Management &amp; Updates</h3>
                </div>
                <div className='grid grid-cols-2 gap-6'>
                  <div className='space-y-4'>
                    <label className='block'>
                      <span className='text-xs font-bold text-on-surface-variant uppercase tracking-wider'>Primary Phone</span>
                      <input className='mt-1 block w-full bg-surface-container-high border-none rounded-lg text-sm focus:ring-2 focus:ring-surface-tint' type='text' value='+1 (555) 012-3456' />
                    </label>
                    <label className='block'>
                      <span className='text-xs font-bold text-on-surface-variant uppercase tracking-wider'>Mailing Address</span>
                      <input className='mt-1 block w-full bg-surface-container-high border-none rounded-lg text-sm focus:ring-2 focus:ring-surface-tint' type='text' value='742 Evergreen Terrace, Springfield' />
                    </label>
                  </div>
                  <div className='space-y-4'>
                    <label className='block'>
                      <span className='text-xs font-bold text-on-surface-variant uppercase tracking-wider'>Coverage Level</span>
                      <select className='mt-1 block w-full bg-surface-container-high border-none rounded-lg text-sm focus:ring-2 focus:ring-surface-tint'>
                        <option>Gold (Current)</option>
                        <option>Platinum (Upgrade Available)</option>
                        <option>Silver (Down-tier)</option>
                      </select>
                    </label>
                    <div className='flex items-end h-full'>
                      <button className='w-full py-2.5 bg-blue-900 text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-blue-800'>Update Information</button>
                    </div>
                  </div>
                </div>
                <div className='mt-8 p-4 bg-white rounded-xl border border-outline-variant/20'>
                  <div className='flex justify-between items-start'>
                    <div>
                      <p className='text-sm font-bold text-blue-900'>Upcoming Policy Adjustment</p>
                      <p className='text-xs text-on-surface-variant mt-1'>Change to "Platinum Plan" requested for next billing cycle.</p>
                    </div>
                    <span className='bg-tertiary-container/10 text-tertiary-container px-2 py-1 rounded text-[10px] font-bold uppercase'>Pending</span>
                  </div>
                </div>
              </div>
              <div className='col-span-12 lg:col-span-5 bg-surface-container-low rounded-xl p-8 flex flex-col'>
                <div className='flex items-center gap-3 mb-6'>
                  <span className='material-symbols-outlined text-error'>warning</span>
                  <h3 className='text-xl font-bold text-blue-900'>Policy Termination</h3>
                </div>
                <div className='bg-error-container/20 border border-error/10 p-5 rounded-xl mb-6'>
                  <div className='flex gap-4'>
                    <span className='material-symbols-outlined text-error'>info</span>
                    <div>
                      <p className='text-sm font-bold text-error'>Review Cancellation Terms</p>
                      <ul className='text-xs text-on-surface-variant mt-2 space-y-2 list-disc pl-4'>
                        <li>Cancellation effective at end of current month (Oct 31)</li>
                        <li>Pro-rated refund available: <strong>$125.40</strong></li>
                        <li>Loss of "No-Claim" bonus accumulated ($500 value)</li>
                        <li>Penalty fee for early termination: <strong>$50.00</strong></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className='mt-auto'>
                  <div className='flex items-center gap-2 mb-4'>
                    <input className='rounded text-error focus:ring-error border-outline-variant' type='checkbox' />
                    <span className='text-xs text-on-surface-variant'>I understand the coverage gaps following termination.</span>
                  </div>
                  <button className='w-full py-3 border-2 border-error text-error font-bold rounded-xl hover:bg-error hover:text-white transition-all text-sm uppercase tracking-widest'>
                    Initiate Cancellation Request
                  </button>
                </div>
              </div>
            </div>
            <footer className='flex justify-between items-center pt-8 border-t border-outline-variant/10 text-[10px] font-bold uppercase tracking-widest text-outline'>
              <p>© 2024 CLARIFIED GUARDIAN • ALL RIGHTS RESERVED</p>
              <div className='flex gap-6'>
                <a className='hover:text-primary' href='#'>Privacy Policy</a>
                <a className='hover:text-primary' href='#'>Terms of Service</a>
                <a className='hover:text-primary' href='#'>HIPAA Compliance</a>
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
