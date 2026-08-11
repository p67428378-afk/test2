import React from 'react';

const DashboardLayout = () => {
  return (
    <div className='bg-surface text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed'>
      {/* TopNavBar */}
      <nav className='fixed top-0 w-full z-50 flex justify-between items-center px-8 h-16 bg-[#faf8ff]/80 dark:bg-[#00020c]/80 backdrop-blur-xl border-b border-[#757780]/15'>
        <div className='flex items-center gap-8'>
          <span className='text-2xl font-bold tracking-tight text-[#00020c] dark:text-[#faf8ff] font-manrope'>Digital Ledger</span>
          <div className='hidden md:flex gap-6'>
            <a className='text-sm font-semibold tracking-tight text-[#00020c] dark:text-[#ffffff] border-b-2 border-[#001a48] pb-1' href='#'>Dashboard</a>
            <a className='text-sm font-semibold tracking-tight text-[#515f74] dark:text-[#d2d9f4] hover:text-[#00020c] transition-colors' href='#'>Portfolios</a>
            <a className='text-sm font-semibold tracking-tight text-[#515f74] dark:text-[#d2d9f4] hover:text-[#00020c] transition-colors' href='#'>Reports</a>
          </div>
        </div>
        <div className='flex items-center gap-4'>
          <div className='relative hidden lg:block'>
            <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm'>search</span>
            <input className='pl-10 pr-4 py-1.5 bg-surface-container-low border-none rounded-md text-sm focus:ring-1 focus:ring-primary-container w-64' placeholder='Search accounts...' type='text'/>
          </div>
          <button className='p-2 rounded-full hover:bg-[#f2f3ff] transition-colors relative'>
            <span className='material-symbols-outlined text-[#515f74]'>notifications</span>
            <span className='absolute top-2 right-2 w-2 h-2 bg-error rounded-full'></span>
          </button>
          <img alt='User profile avatar' className='w-8 h-8 rounded-full border border-outline-variant/30' data-alt='professional male headshot with dark hair and blue business suit against a clean studio background' src='https://lh3.googleusercontent.com/aida-public/AB6AXuCEmW9V-HT5h09GGLAer1GOzWgAGtaUSRXHXOdAowbJ7Gy8uyeDpWGdEpuJk8EAtpBk9vQLSz7Y1ia0Rt03OLOr18sY1sFQpgjqlmQmJVOLclEBO--gTTHrWdO2giQmyjHn1GA6ErdvlNMx9akUIPeSO_NAQbRjaJ8MR8G0Q5rzML6jllpmpV6vkrNq-sgQvBDEbAYKzXhaVISLFf6jcgu6H6r8UMNRp1NQr09U2gE71tk5dJ_qFRrvZBNrGI3LgpBHP0Uc_j9x7MZ6'/>
        </div>
      </nav>
      {/* SideNavBar */}
      <aside className='fixed left-0 top-16 h-[calc(100vh-4rem)] flex flex-col p-4 bg-[#f2f3ff] dark:bg-[#001a48] w-64 border-r border-[#757780]/15 z-40'>
        <div className='mb-8 px-4'>
          <p className='text-[10px] uppercase tracking-[0.2em] text-secondary font-bold mb-1'>Institutional Credit</p>
          <p className='text-sm font-bold text-primary font-manrope'>Main Menu</p>
        </div>
        <div className='flex flex-col gap-2'>
          <a className='flex items-center gap-3 px-4 py-3 text-sm font-semibold tracking-tight text-[#515f74] dark:text-[#d2d9f4] hover:text-[#00020c] transition-all hover:translate-x-1' href='#'>
            <span className='material-symbols-outlined' data-icon='dashboard'>dashboard</span> Overview
          </a>
          <a className='flex items-center gap-3 px-4 py-3 text-sm font-semibold tracking-tight bg-[#ffffff] dark:bg-[#00020c] text-[#001a48] dark:text-[#faf8ff] rounded-md shadow-sm translate-x-1' href='#'>
            <span className='material-symbols-outlined' data-icon='assignment_add'>assignment_add</span> Applications
          </a>
          <a className='flex items-center gap-3 px-4 py-3 text-sm font-semibold tracking-tight text-[#515f74] dark:text-[#d2d9f4] hover:text-[#00020c] transition-all hover:translate-x-1' href='#'>
            <span className='material-symbols-outlined' data-icon='payments'>payments</span> Accounts
          </a>
          <a className='flex items-center gap-3 px-4 py-3 text-sm font-semibold tracking-tight text-[#515f74] dark:text-[#d2d9f4] hover:text-[#00020c] transition-all hover:translate-x-1' href='#'>
            <span className='material-symbols-outlined' data-icon='settings'>settings</span> Settings
          </a>
        </div>
        <div className='mt-auto p-4 bg-surface-container-highest/30 rounded-xl'>
          <p className='text-xs font-semibold text-secondary mb-2'>Credit Limit Usage</p>
          <div className='h-1.5 w-full bg-primary-fixed-dim rounded-full overflow-hidden'>
            <div className='h-full bg-primary w-[42%]'></div>
          </div>
          <p className='text-[10px] text-right mt-2 font-medium'>42% of $50,000</p>
        </div>
      </aside>
      {/* Main Content */}
      <main className='ml-64 pt-24 px-10 pb-12 min-h-screen'>
        {/* Header Section: Asymmetric & Bold */}
        <header className='flex flex-col md:flex-row justify-between items-end mb-12 gap-6'>
          <div className='max-w-2xl'>
            <h1 className='text-5xl font-extrabold font-manrope text-primary tracking-tighter leading-none mb-4'>Architectural Trust.</h1>
            <p className='text-lg text-secondary font-body max-w-lg'>Manage your institutional credit lines and explore premium card products designed for high-velocity capital.</p>
          </div>
          <div className='flex gap-4'>
            <button className='bg-surface-container-high text-on-surface px-6 py-2.5 rounded-md text-sm font-bold font-manrope hover:bg-surface-container-highest transition-colors'>Download Specs</button>
            <button className='bg-primary text-on-primary px-6 py-2.5 rounded-md text-sm font-bold font-manrope hover:opacity-90 transition-opacity'>Contact Advisor</button>
          </div>
        </header>
        <div className='grid grid-cols-12 gap-8'>
          {/* Section 1: Available Credit Card Products (Full Width) */}
          <section className='col-span-12 space-y-6'>
            <div className='flex justify-between items-center'>
              <h2 className='text-2xl font-bold font-manrope text-primary tracking-tight'>Available Credit Products</h2>
              <a className='text-sm font-bold text-primary-container border-b border-primary-container/20 hover:border-primary-container pb-0.5' href='#'>View all cards</a>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              {/* Elite Rewards */}
              <div className='group bg-surface-container-lowest p-8 rounded-xl shadow-ambient border-b-4 border-primary transition-transform hover:-translate-y-1'>
                <div className='flex justify-between items-start mb-12'>
                  <span className='material-symbols-outlined text-primary text-4xl' data-icon='star' style={{'fontVariationSettings': "'FILL' 1"}}>star</span>
                  <div className='text-right'>
                    <p className='text-[10px] uppercase tracking-widest text-secondary font-bold'>Variable APR</p>
                    <p className='text-xl font-bold font-manrope'>14.99%</p>
                  </div>
                </div>
                <h3 className='text-2xl font-bold font-manrope mb-2'>Elite Rewards</h3>
                <p className='text-sm text-secondary mb-6 h-10'>Premium benefits for global travel and lifestyle expenditure.</p>
                <ul className='space-y-3 mb-8'>
                  <li className='flex items-center gap-2 text-xs font-semibold text-on-surface-variant'>
                    <span className='material-symbols-outlined text-sm'>check_circle</span> 3% Cashback on Travel
                  </li>
                  <li className='flex items-center gap-2 text-xs font-semibold text-on-surface-variant'>
                    <span className='material-symbols-outlined text-sm'>check_circle</span> Concierge Service 24/7
                  </li>
                  <li className='flex items-center gap-2 text-xs font-semibold text-on-surface-variant'>
                    <span className='material-symbols-outlined text-sm'>check_circle</span> No Annual Fee First Year
                  </li>
                </ul>
                <button className='w-full bg-primary text-on-primary py-3 rounded-md font-bold text-sm tracking-tight hover:opacity-90'>Apply Now</button>
              </div>
              {/* Cashback Prime */}
              <div className='group bg-surface-container-low p-8 rounded-xl border-b-4 border-outline-variant/30 transition-transform hover:-translate-y-1'>
                <div className='flex justify-between items-start mb-12'>
                  <span className='material-symbols-outlined text-primary text-4xl' data-icon='savings'>savings</span>
                  <div className='text-right'>
                    <p className='text-[10px] uppercase tracking-widest text-secondary font-bold'>Cashback</p>
                    <p className='text-xl font-bold font-manrope'>Up to 5%</p>
                  </div>
                </div>
                <h3 className='text-2xl font-bold font-manrope mb-2'>Cashback Prime</h3>
                <p className='text-sm text-secondary mb-6 h-10'>Optimized for day-to-day business operations and utility.</p>
                <ul className='space-y-3 mb-8'>
                  <li className='flex items-center gap-2 text-xs font-semibold text-on-surface-variant'>
                    <span className='material-symbols-outlined text-sm'>check_circle</span> 5% on Office Supplies
                  </li>
                  <li className='flex items-center gap-2 text-xs font-semibold text-on-surface-variant'>
                    <span className='material-symbols-outlined text-sm'>check_circle</span> Unlimited 1.5% Everywhere
                  </li>
                  <li className='flex items-center gap-2 text-xs font-semibold text-on-surface-variant'>
                    <span className='material-symbols-outlined text-sm'>check_circle</span> Zero Foreign Fees
                  </li>
                </ul>
                <button className='w-full bg-surface-container-high text-on-surface py-3 rounded-md font-bold text-sm tracking-tight hover:bg-surface-container-highest'>Apply Now</button>
              </div>
              {/* Business Platinum */}
              <div className='group relative overflow-hidden bg-primary-container p-8 rounded-xl shadow-ambient transition-transform hover:-translate-y-1'>
                <div className='absolute -right-8 -top-8 w-32 h-32 bg-on-primary-container/10 rounded-full blur-3xl'></div>
                <div className='flex justify-between items-start mb-12'>
                  <span className='material-symbols-outlined text-primary-fixed-dim text-4xl' data-icon='account_balance'>account_balance</span>
                  <div className='text-right text-on-primary'>
                    <p className='text-[10px] uppercase tracking-widest text-on-primary-container font-bold'>Credit Limit</p>
                    <p className='text-xl font-bold font-manrope'>$250k+</p>
                  </div>
                </div>
                <h3 className='text-2xl font-bold font-manrope mb-2 text-white'>Business Platinum</h3>
                <p className='text-sm text-on-primary-container mb-6 h-10'>The ultimate tool for scaling institutional assets and trade.</p>
                <ul className='space-y-3 mb-8'>
                  <li className='flex items-center gap-2 text-xs font-semibold text-on-primary-container'>
                    <span className='material-symbols-outlined text-sm'>check_circle</span> Dedicated Relationship Lead
                  </li>
                  <li className='flex items-center gap-2 text-xs font-semibold text-on-primary-container'>
                    <span className='material-symbols-outlined text-sm'>check_circle</span> Advanced Fraud Protection
                  </li>
                  <li className='flex items-center gap-2 text-xs font-semibold text-on-primary-container'>
                    <span className='material-symbols-outlined text-sm'>check_circle</span> Flexible Repayment Terms
                  </li>
                </ul>
                <button className='w-full bg-primary-fixed-dim text-primary py-3 rounded-md font-bold text-sm tracking-tight hover:bg-white transition-colors'>Apply Now</button>
              </div>
            </div>
          </section>
          {/* Section 2: New Application Form (Large Column) */}
          <section className='col-span-12 lg:col-span-8 space-y-6'>
            <div className='bg-surface-container-lowest p-10 rounded-xl shadow-ambient'>
              <div className='flex items-center gap-4 mb-10'>
                <div className='w-12 h-12 bg-primary flex items-center justify-center rounded-lg'>
                  <span className='material-symbols-outlined text-white'>description</span>
                </div>
                <div>
                  <h2 className='text-2xl font-bold font-manrope text-primary tracking-tight'>New Application</h2>
                  <p className='text-sm text-secondary'>Draft your institution's credit facility request.</p>
                </div>
              </div>
              <form className='space-y-8'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8'>
                  {/* Personal Info */}
                  <div className='space-y-6'>
                    <p className='text-[10px] uppercase tracking-widest text-secondary font-bold mb-4'>Primary Applicant</p>
                    <div className='relative'>
                      <label className='absolute -top-2 left-2 px-1 bg-surface-container-lowest text-[10px] font-bold text-secondary uppercase tracking-wider'>Full Name</label>
                      <input className='w-full bg-surface-container-low border-none border-b border-outline/30 focus:border-primary-container focus:ring-0 p-4 text-sm font-medium' type='text' value='Alexander Sterling'/>
                    </div>
                    <div className='relative'>
                      <label className='absolute -top-2 left-2 px-1 bg-surface-container-lowest text-[10px] font-bold text-secondary uppercase tracking-wider'>Phone Number</label>
                      <input className='w-full bg-surface-container-low border-none border-b border-outline/30 focus:border-primary-container focus:ring-0 p-4 text-sm font-medium' placeholder='+1 (555) 000-0000' type='tel'/>
                    </div>
                    <div className='relative'>
                      <label className='absolute -top-2 left-2 px-1 bg-surface-container-lowest text-[10px] font-bold text-secondary uppercase tracking-wider'>Email Address</label>
                      <input className='w-full bg-surface-container-low border-none border-b border-outline/30 focus:border-primary-container focus:ring-0 p-4 text-sm font-medium' placeholder='a.sterling@capital.io' type='email'/>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div className='relative'>
                        <label className='absolute -top-2 left-2 px-1 bg-surface-container-lowest text-[10px] font-bold text-secondary uppercase tracking-wider'>Credit Score</label>
                        <input className='w-full bg-surface-container-low border-none border-b border-outline/30 focus:border-primary-container focus:ring-0 p-4 text-sm font-medium' placeholder='750' type='number'/>
                      </div>
                      <div className='relative'>
                        <label className='absolute -top-2 left-2 px-1 bg-surface-container-lowest text-[10px] font-bold text-secondary uppercase tracking-wider'>Annual Income</label>
                        <input className='w-full bg-surface-container-low border-none border-b border-outline/30 focus:border-primary-container focus:ring-0 p-4 text-sm font-medium' placeholder='$185,000' type='text'/>
                      </div>
                    </div>
                    <div className='relative'>
                      <label className='absolute -top-2 left-2 px-1 bg-surface-container-lowest text-[10px] font-bold text-secondary uppercase tracking-wider'>Mailing Address</label>
                      <textarea className='w-full bg-surface-container-low border-none border-b border-outline/30 focus:border-primary-container focus:ring-0 p-4 text-sm font-medium resize-none' rows='2'>1200 Wall Street, Financial District, NY 10005</textarea>
                    </div>
                  </div>
                  {/* Employment Info */}
                  <div className='space-y-6'>
                    <p className='text-[10px] uppercase tracking-widest text-secondary font-bold mb-4'>Employment Details</p>
                    <div className'relative'>
                      <label className='absolute -top-2 left-2 px-1 bg-surface-container-lowest text-[10px] font-bold text-secondary uppercase tracking-wider'>Employer Name</label>
                      <input className='w-full bg-surface-container-low border-none border-b border-outline/30 focus:border-primary-container focus:ring-0 p-4 text-sm font-medium' type='text' value='Sterling Global Capital'/>
                    </div>
                    <div className='relative'>
                      <label className='absolute -top-2 left-2 px-1 bg-surface-container-lowest text-[10px] font-bold text-secondary uppercase tracking-wider'>Job Title</label>
                      <input className='w-full bg-surface-container-low border-none border-b border-outline/30 focus:border-primary-container focus:ring-0 p-4 text-sm font-medium' placeholder='Managing Partner' type='text'/>
                    </div>
                    <div className='relative'>
                      <label className='absolute -top-2 left-2 px-1 bg-surface-container-lowest text-[10px] font-bold text-secondary uppercase tracking-wider'>Employment Start Date</label>
                      <input className='w-full bg-surface-container-low border-none border-b border-outline/30 focus:border-primary-container focus:ring-0 p-4 text-sm font-medium' type='date'/>
                    </div>
                    <div className='relative'>
                      <label className='absolute -top-2 left-2 px-1 bg-surface-container-lowest text-[10px] font-bold text-secondary uppercase tracking-wider'>Employer Address</label>
                      <input className='w-full bg-surface-container-low border-none border-b border-outline/30 focus:border-primary-container focus:ring-0 p-4 text-sm font-medium' placeholder='45 Park Ave, New York, NY' type='text'/>
                    </div>
                    {/* Dropzone */}
                    <div className='mt-4'>
                      <label className='block text-[10px] font-bold text-secondary uppercase tracking-wider mb-2'>Verification Documents</label>
                      <div className='border-2 border-dashed border-outline-variant/50 rounded-xl p-8 text-center bg-surface-container-low/50 hover:bg-surface-container-low transition-colors cursor-pointer group'>
                        <span className='material-symbols-outlined text-3xl text-secondary mb-2 group-hover:text-primary transition-colors'>cloud_upload</span>
                        <p className='text-sm font-bold text-primary'>Upload Account Statement</p>
                        <p className='text-[10px] text-secondary mt-1'>PDF, JPG or PNG (Max 10MB)</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex justify-end pt-8 border-t border-outline-variant/10'>
                  <button className='bg-primary text-on-primary px-12 py-4 rounded-md font-bold font-manrope shadow-ambient hover:opacity-90 active:scale-95 transition-all' type='button'>Submit Application</button>
                </div>
              </form>
            </div>
          </section>
          {/* Section 3 & 4: Overview and Dynamic Action (Sidebar Grid) */}
          <aside className='col-span-12 lg:col-span-4 space-y-8'>
            {/* Section 3: My Applications Overview */}
            <section className='space-y-4'>
              <h2 className='text-xl font-bold font-manrope text-primary tracking-tight'>Active Inquiries</h2>
              <div className='bg-surface-container-lowest rounded-xl shadow-ambient overflow-hidden'>
                <div className='divide-y divide-outline-variant/10'>
                  {/* Pending App */}
                  <div className='p-6 hover:bg-surface-container-low transition-colors cursor-pointer group bg-surface-container-low/30'>
                    <div className='flex justify-between items-start mb-2'>
                      <p className='text-[10px] font-bold text-secondary uppercase tracking-wider'>APP-88429-01</p>
                      <span className='px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter bg-surface-container-high text-secondary'>Pending</span>
                    </div>
                    <h4 className='font-bold text-sm text-primary'>Elite Rewards</h4>
                    <p className='text-xs text-secondary mt-1'>Last edited 2h ago</p>
                  </div>
                  {/* Approved App */}
                  <div className='p-6 hover:bg-surface-container-low transition-colors cursor-pointer group'>
                    <div className='flex justify-between items-start mb-2'>
                      <p className='text-[10px] font-bold text-secondary uppercase tracking-wider'>APP-87211-04</p>
                      <span className='px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter bg-primary-fixed-dim text-on-primary-fixed-variant'>Approved</span>
                    </div>
                    <h4 className='font-bold text-sm text-primary'>Business Platinum</h4>
                    <p className='text-xs text-secondary mt-1'>Finalized yesterday</p>
                  </div>
                  {/* Denied App */}
                  <div className='p-6 hover:bg-surface-container-low transition-colors cursor-pointer group'>
                    <div className='flex justify-between items-start mb-2'>
                      <p className='text-[10px] font-bold text-secondary uppercase tracking-wider'>APP-86992-09</p>
                      <span className='px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tighter bg-error-container text-on-error-container'>Denied</span>
                    </div>
                    <h4 className='font-bold text-sm text-primary'>Cashback Prime</h4>
                    <p className='text-xs text-secondary mt-1'>Closed 4 days ago</p>
                  </div>
                </div>
              </div>
            </section>
            {/* Section 4: Dynamic Action Area (Stateful Card) */}
            <section className='space-y-4'>
              <h2 className='text-xl font-bold font-manrope text-primary tracking-tight'>Status Insight</h2>
              {/* Scenario A: Pending State (Currently Selected) */}
              <div className='bg-surface-container-lowest p-6 rounded-xl border-l-4 border-primary shadow-ambient space-y-4'>
                <div className='flex items-center gap-2 mb-2'>
                  <span className='material-symbols-outlined text-primary' data-icon='edit_note'>edit_note</span>
                  <span className='text-xs font-bold text-primary uppercase'>Draft Action Required</span>
                </div>
                <p className='text-sm text-secondary leading-relaxed'>Your application for <span className='font-bold text-primary'>Elite Rewards</span> is incomplete. Update your credit score and attach a recent pay stub to proceed.</p>
                <div className='grid grid-cols-2 gap-3 pt-4'>
                  <button className='bg-surface-container-high text-on-surface py-2 rounded font-bold text-[10px] uppercase tracking-widest hover:bg-surface-container-highest'>Save Draft</button>
                  <button className='bg-primary text-on-primary py-2 rounded font-bold text-[10px] uppercase tracking-widest hover:opacity-90'>Submit</button>
                </div>
              </div>
              {/* Scenario B: Denied Message (Informational) */}
              <div className='bg-error-container/20 p-6 rounded-xl border border-error/10 space-y-3'>
                <div className='flex items-center gap-2'>
                  <span className='material-symbols-outlined text-error' data-icon='error_outline'>error_outline</span>
                  <span className='text-xs font-bold text-error uppercase'>Review Decision</span>
                </div>
                <p className='text-xs text-on-error-container leading-relaxed'>Application APP-86992-09: Insufficient credit history for this product. We recommend building your profile with a smaller credit line first.</p>
                <a className='text-[10px] font-bold text-error underline uppercase tracking-widest' href='#'>Learn more</a>
              </div>
              {/* Scenario C: Success/Processing */}
              <div className='bg-surface-container p-6 rounded-xl space-y-3'>
                <div className='flex items-center gap-2'>
                  <span className='material-symbols-outlined text-primary-container' data-icon='verified' style={{'fontVariationSettings': "'FILL' 1"}}>verified</span>
                  <span className='text-xs font-bold text-primary-container uppercase'>System Message</span>
                </div>
                <p className='text-xs text-on-secondary-container font-medium'>No further action required. Our team is processing your request for the Business Platinum card. Estimated response time: 24-48 hours.</p>
              </div>
            </section>
            {/* Help Desk Card */}
            <div className='bg-primary-container p-8 rounded-xl text-center relative overflow-hidden'>
              <div className='absolute inset-0 opacity-10' style={{'backgroundImage': "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", 'backgroundSize': "24px 24px"}}></div>
              <span className='material-symbols-outlined text-4xl text-primary-fixed-dim mb-4'>support_agent</span>
              <h3 className='text-white font-bold font-manrope mb-2'>Need Guidance?</h3>
              <p className='text-[10px] text-on-primary-container mb-6 leading-relaxed uppercase tracking-wider'>Consult with our credit architects for bespoke financial structuring.</p>
              <button className='w-full bg-white text-primary py-2.5 rounded font-bold text-xs'>Schedule Consultation</button>
            </div>
          </aside>
        </div>
      </main>
      {/* Footer Meta (Subtle) */}
      <footer className='ml-64 px-10 py-8 border-t border-outline-variant/10 flex justify-between items-center text-[10px] font-bold text-secondary uppercase tracking-[0.2em]'>
        <div>© 2024 Digital Ledger Institutional</div>
        <div className='flex gap-8'>
          <a className='hover:text-primary transition-colors' href='#'>Privacy Protocol</a>
          <a className='hover:text-primary transition-colors' href='#'>Terms of Service</a>
          <a className='hover:text-primary transition-colors' href='#'>Compliance</a>
        </div>
      </footer>
    </div>
  );
};

export default DashboardLayout;
