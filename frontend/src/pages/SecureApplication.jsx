import React from 'react';

const SecureApplication = ({ navigateTo }) => {
  return (
    <div className="bg-background text-on-surface font-body antialiased">
      <header className="fixed top-0 w-full z-50 glass-header">
        <div className="flex items-center justify-between px-6 h-16 w-full">
          <div className="flex items-center gap-3">
            <span onClick={() => navigateTo('comparison')} className="material-symbols-outlined text-[#004A99] cursor-pointer">arrow_back</span>
            <h1 className="text-lg font-bold text-[#004A99] font-headline tracking-tight">Sovereign Finance</h1>
          </div>
          <div className="w-8 h-8 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant/20">
            <img alt="User Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBSUrlA8F7oIZLlCSA5Njy6K25cbekEBwC20K6iutpWKN1dmTCAb8mYUJ8R2UMHoqJ4-aJ_Y1r6yh2mZBibgB5slzoQ95NunDUsGxR0WZHXe_AKIZTGVI1BDV_39-BT8q7IxSCAaXCsW-bma9mrABuzrS-17PUYT7REmWkZx0FNpth7m9BJNzi7lgPKkHN0bD13JzrBElQ-LbPrlbOaH6ECdyYP67DTmbgUXoctzITZdZkzfvkr7aycU73jZ3EeM7zCwLhlk6VAdLrX"/>
          </div>
        </div>
      </header>
      <main className="pt-24 pb-32 px-6 max-w-md mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-primary/60 font-label">Step 2 of 3</span>
            <h2 className="text-2xl font-bold font-headline text-on-surface">Secure Application</h2>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-tertiary-container/10 rounded-full border border-tertiary-container/20">
            <span className="material-symbols-outlined text-tertiary text-sm">verified_user</span>
            <span className="text-[10px] font-bold text-tertiary uppercase tracking-tighter">256-bit AES</span>
          </div>
        </div>
        <form className="space-y-8">
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-xl">person</span>
              <h3 className="font-headline font-semibold text-lg">Personal Identity</h3>
            </div>
            <div className="bg-surface-container-low p-5 rounded-xl space-y-5">
              <div className="relative group">
                <label className="text-[10px] font-bold text-primary/70 uppercase mb-1 block ml-1">Full Legal Name</label>
                <input className="w-full bg-surface-container-lowest border-none border-b-2 border-outline-variant/30 focus:border-primary focus:ring-0 transition-all px-4 py-3 text-on-surface rounded-t-lg" placeholder="Alex Sterling" type="text"/>
              </div>
              <div className="relative group">
                <label className="text-[10px] font-bold text-primary/70 uppercase mb-1 block ml-1">Residential Address</label>
                <input className="w-full bg-surface-container-lowest border-none border-b-2 border-outline-variant/30 focus:border-primary focus:ring-0 transition-all px-4 py-3 text-on-surface rounded-t-lg" placeholder="1280 Sovereign Way, NY" type="text"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <label className="text-[10px] font-bold text-primary/70 uppercase mb-1 block ml-1">Phone</label>
                  <input className="w-full bg-surface-container-lowest border-none border-b-2 border-outline-variant/30 focus:border-primary focus:ring-0 transition-all px-4 py-3 text-sm rounded-t-lg" placeholder="+1 (555) 000-0000" type="tel"/>
                </div>
                <div className="relative group">
                  <label className="text-[10px] font-bold text-primary/70 uppercase mb-1 block ml-1">Email</label>
                  <input className="w-full bg-surface-container-lowest border-none border-b-2 border-outline-variant/30 focus:border-primary focus:ring-0 transition-all px-4 py-3 text-sm rounded-t-lg" placeholder="alex@sterling.com" type="email"/>
                </div>
              </div>
            </div>
          </section>
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-xl">account_balance_wallet</span>
              <h3 className="font-headline font-semibold text-lg">Financial Health</h3>
            </div>
            <div className="bg-surface-container-low p-5 rounded-xl space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-surface-container-lowest rounded-lg border-b-2 border-outline-variant/20">
                  <label className="text-[10px] font-bold text-primary/70 uppercase mb-1 block">Credit Score</label>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold font-headline">780</span>
                    <span className="text-[10px] text-tertiary font-bold">Excellent</span>
                  </div>
                </div>
                <div className="p-4 bg-surface-container-lowest rounded-lg border-b-2 border-outline-variant/20">
                  <label className="text-[10px] font-bold text-primary/70 uppercase mb-1 block">Annual Income</label>
                  <input className="w-full bg-transparent border-none focus:ring-0 p-0 font-bold text-on-surface" placeholder="$120,000" type="text"/>
                </div>
              </div>
              <div className="relative">
                <label className="text-[10px] font-bold text-primary/70 uppercase mb-2 block ml-1">Bank Statements (Last 3 Months)</label>
                <div className="border-2 border-dashed border-outline-variant/40 bg-surface-container-low rounded-xl p-8 flex flex-col items-center justify-center text-center group hover:bg-white transition-all cursor-pointer">
                  <span className="material-symbols-outlined text-primary mb-2 text-3xl">cloud_upload</span>
                  <p className="text-xs font-semibold text-on-surface-variant">Tap to upload PDF or JPEG</p>
                  <p className="text-[9px] text-outline mt-1 uppercase tracking-widest">Max file size 10MB</p>
                </div>
              </div>
            </div>
          </section>
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-xl">work</span>
              <h3 className="font-headline font-semibold text-lg">Employment</h3>
            </div>
            <div className="bg-surface-container-low p-5 rounded-xl space-y-5">
              <div className="relative group">
                <label className="text-[10px] font-bold text-primary/70 uppercase mb-1 block ml-1">Employer Name</label>
                <input className="w-full bg-surface-container-lowest border-none border-b-2 border-outline-variant/30 focus:border-primary focus:ring-0 transition-all px-4 py-3 text-on-surface rounded-t-lg" placeholder="Global Tech Corp" type="text"/>
              </div>
              <div className="relative group">
                <label className="text-[10px] font-bold text-primary/70 uppercase mb-1 block ml-1">Job Title</label>
                <input className="w-full bg-surface-container-lowest border-none border-b-2 border-outline-variant/30 focus:border-primary focus:ring-0 transition-all px-4 py-3 text-on-surface rounded-t-lg" placeholder="Senior Strategy Lead" type="text"/>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <label className="text-[10px] font-bold text-primary/70 uppercase mb-1 block ml-1">Start Date</label>
                  <input className="w-full bg-surface-container-lowest border-none border-b-2 border-outline-variant/30 focus:border-primary focus:ring-0 transition-all px-4 py-3 text-sm rounded-t-lg" type="date"/>
                </div>
                <div className="relative group">
                  <label className="text-[10px] font-bold text-primary/70 uppercase mb-1 block ml-1">Work Type</label>
                  <select className="w-full bg-surface-container-lowest border-none border-b-2 border-outline-variant/30 focus:border-primary focus:ring-0 transition-all px-4 py-3 text-sm rounded-t-lg appearance-none">
                    <option>Full-time</option>
                    <option>Contract</option>
                    <option>Self-employed</option>
                  </select>
                </div>
              </div>
            </div>
          </section>
          <div className="pt-4">
            <button className="w-full py-4 px-6 bg-gradient-to-br from-primary to-primary-container text-on-primary font-headline font-bold text-sm rounded-xl shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3" type="submit">
              <span className="material-symbols-outlined text-lg">lock</span>
              Submit Secure Application
            </button>
            <div className="mt-4 flex items-center justify-center gap-2 opacity-60">
              <span className="material-symbols-outlined text-sm">info</span>
              <span className="text-[10px] font-medium font-body uppercase tracking-tight">Your data is stored on encrypted servers in NYC.</span>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default SecureApplication;
