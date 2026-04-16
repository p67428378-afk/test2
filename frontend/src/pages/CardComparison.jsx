import React from 'react';

const CardComparison = ({ navigateTo }) => {
  return (
    <div className="bg-background font-body text-on-surface antialiased pb-24">
      <header className="fixed top-0 w-full z-50 bg-slate-50/80 backdrop-blur-md flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-4">
          <span className="material-symbols-outlined text-[#004A99]">menu</span>
          <span className="font-headline font-bold text-lg tracking-tight text-[#004A99]">Sovereign Finance</span>
        </div>
        <div className="h-8 w-8 rounded-full bg-surface-container-high overflow-hidden">
          <img alt="User Profile" className="h-full w-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuADSaZ0cSb63eVmPF4M1d_6-77eLNn1itY9kICspQ2t53T2YEnRxxzHDow9PdcZNRDE_tIvw4k8chWusECgLpsWetXvPSZAUG7J3bOGGIDdSNnRoJ8lqWjRcQtfFPFK2N-Fae-ZDwvpFyGUQRquoDA1mb0IeEGdHKQ9PijV2hTgoTWr4FsRqqUwnoexUlXuhfkbdRo29zcLEXCAXGCp54WA77lQZuke2UmBiOcRrfI_qhgKUKzqSeTRkpv3DgRE1DsxbCn4Wi6IytIt"/>
        </div>
      </header>
      <main className="mt-20 px-6 max-w-lg mx-auto">
        <header className="mb-8">
          <h1 className="font-headline text-3xl font-extrabold text-primary tracking-tight mb-2">Compare Cards</h1>
          <p className="text-on-surface-variant font-body text-sm leading-relaxed">Select the perfect key to your financial future. Precision-engineered rewards for every lifestyle.</p>
        </header>
        <div className="flex items-center gap-3 mb-8">
          <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-surface-container-lowest border border-outline-variant/15 rounded-xl transition-all duration-200 active:scale-95 card-shadow">
            <span className="material-symbols-outlined text-sm">tune</span>
            <span className="font-label text-sm font-semibold">Filter</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-surface-container-lowest border border-outline-variant/15 rounded-xl transition-all duration-200 active:scale-95 card-shadow">
            <span className="material-symbols-outlined text-sm">swap_vert</span>
            <span className="font-label text-sm font-semibold">Sort</span>
          </button>
        </div>
        <div className="space-y-6">
          <article className="bg-surface-container-low rounded-2xl overflow-hidden p-6 relative">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="font-headline text-xl font-bold text-primary mb-1">Sovereign Onyx</h2>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-tertiary-container text-on-tertiary-container">Elite Selection</span>
              </div>
              <div className="h-12 w-20 bg-gradient-to-br from-slate-900 to-slate-700 rounded-lg flex items-center justify-center shadow-lg transform rotate-[-4deg]">
                <div className="text-[8px] text-white/40 tracking-widest font-mono">SOVEREIGN</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-outline font-bold">APR</p>
                <p className="font-headline text-lg font-bold text-on-surface">14.99% - 21.99%</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[10px] uppercase tracking-wider text-outline font-bold">Rewards</p>
                <p className="font-headline text-lg font-bold text-on-surface">5x Points</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-outline font-bold">Eligibility</p>
                <p className="font-headline text-lg font-bold text-tertiary">740+ Credit</p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-[10px] uppercase tracking-wider text-outline font-bold">Annual Fee</p>
                <p className="font-headline text-lg font-bold text-on-surface">$495</p>
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-4 mb-6">
              <h3 className="font-label text-xs font-bold uppercase text-outline mb-3 tracking-widest">Key Benefits</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-on-surface">
                  <span className="material-symbols-outlined text-primary text-lg">verified</span>
                  <span>Unlimited Airport Lounge Access</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-on-surface">
                  <span className="material-symbols-outlined text-primary text-lg">verified</span>
                  <span>$300 Annual Travel Credit</span>
                </li>
              </ul>
            </div>
            <button onClick={() => navigateTo('application')} className="w-full premium-gradient text-on-primary py-4 rounded-xl font-headline font-bold transition-all duration-200 active:scale-95 shadow-lg shadow-primary/20">Apply Now</button>
          </article>
        </div>
      </main>
    </div>
  );
};

export default CardComparison;
