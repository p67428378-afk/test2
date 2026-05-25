import React from 'react';

function App() {
  return (
    <div className="bg-background text-on-surface font-body min-h-screen pb-24">
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 py-4 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-slate-200/40 dark:hover:bg-slate-800/40 transition-colors rounded-full">
            <span className="material-symbols-outlined text-blue-900 dark:text-blue-400">menu</span>
          </button>
          <h1 className="font-manrope tracking-tight font-bold text-2xl text-blue-900 dark:text-blue-400">Equinox Banking</h1>
        </div>
        <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high ring-2 ring-primary/10">
          <img alt="User Profile Image" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJdp7Tozwp1Rh8wZZBAVR65N7jPRC3Lb3S5DdmlsBiwDgmWSbvMQckyWcfT_gT7GilPWYYgdhjwozEs7d8BHraV4nWQI16zN8O46ELGMO89UXW203Gkjks-XcyiJ_qO4WYMeZY1kzmm1dzm5czaW85CSsCvfpVufb5F_jVUeev2svb67cyHzbFoFdr-0gGhuHJk9e94_Yd-Oe-38Lsyn1lLFHG8F4WPcutYjoVG04uM4tH3vo1xszsu5Mh-CjCJBBsoqBziIbYR1A" />
        </div>
      </header>
      <main className="mt-24 px-6 max-w-md mx-auto">
        <section className="mb-10">
          <div className="flex flex-col gap-1">
            <p className="font-inter text-[10px] font-semibold uppercase tracking-wider text-secondary">Total Net Worth</p>
            <h2 className="font-headline font-extrabold text-4xl text-primary tracking-tight">$142,850.42</h2>
          </div>
        </section>
        <section className="space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="font-headline font-bold text-xl text-primary">Your Portfolios</h3>
            <span className="text-primary text-sm font-semibold tracking-wide">VIEW ALL</span>
          </div>
          <div className="group relative overflow-hidden bg-surface-container-lowest rounded-xl shadow-sm p-6 transition-all active:scale-[0.98]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
            <div className="relative flex justify-between items-start">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <p className="font-inter font-medium text-secondary text-sm">Premier Checking •• 4829</p>
                </div>
                <p className="font-headline font-bold text-3xl text-on-surface">$1,500.00</p>
              </div>
              <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
            </div>
          </div>
          <div className="group relative overflow-hidden bg-surface-container-lowest rounded-xl shadow-sm p-6 transition-all active:scale-[0.98]">
            <div className="relative flex justify-between items-start">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary-fixed-dim"></div>
                  <p className="font-inter font-medium text-secondary text-sm">Reserve Savings •• 9102</p>
                </div>
                <p className="font-headline font-bold text-3xl text-on-surface">$5,000.00</p>
              </div>
              <span className="material-symbols-outlined text-outline-variant">chevron_right</span>
            </div>
          </div>
          <div className="bg-error-container/40 rounded-xl p-6 border-l-4 border-error">
            <div className="flex gap-4">
              <span className="material-symbols-outlined text-error">error_outline</span>
              <div className="flex-1 space-y-3">
                <p className="font-inter font-medium text-sm text-on-error-container leading-relaxed">
                  Unable to retrieve balance for <span className="font-bold">International Portfolio</span>. Please try again later.
                </p>
                <button className="flex items-center gap-2 text-error font-bold text-xs tracking-widest uppercase py-1 px-3 bg-white/50 rounded-lg hover:bg-white/80 transition-all">
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  Retry Action
                </button>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-low rounded-xl p-6 relative overflow-hidden">
            <div className="animate-pulse flex flex-col gap-4">
              <div className="h-4 w-32 bg-surface-container-high rounded"></div>
              <div className="h-8 w-48 bg-surface-container-high rounded"></div>
            </div>
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_infinite]"></div>
          </div>
        </section>
        <section className="mt-12 mb-8">
          <h3 className="font-headline font-bold text-xl text-primary mb-6">Recent Activity</h3>
          <div className="grid grid-cols-6 gap-4">
            <div className="col-span-4 bg-surface-container-lowest p-5 rounded-xl shadow-sm flex flex-col justify-between h-32">
              <span className="material-symbols-outlined text-primary">shopping_bag</span>
              <div>
                <p className="text-[10px] uppercase font-bold text-secondary tracking-widest">Aurelius Boutique</p>
                <p className="font-headline font-bold text-lg text-primary">-$1,240.00</p>
              </div>
            </div>
            <div className="col-span-2 bg-secondary-container/30 p-5 rounded-xl flex flex-col items-center justify-center gap-2">
              <span className="material-symbols-outlined text-primary-container">receipt_long</span>
              <p className="text-[10px] text-center font-bold text-primary-container">MANAGE BILLS</p>
            </div>
          </div>
        </section>
      </main>
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg shadow-[0_-10px_30px_rgba(0,0,0,0.03)] rounded-t-lg">
        <button className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:text-blue-700 transition-all vibration-feedback-mimic scale-95 duration-150">
          <span className="material-symbols-outlined mb-1">dashboard</span>
          <span className="font-inter text-[10px] font-semibold uppercase tracking-wider">Reserve</span>
        </button>
        <button className="flex flex-col items-center justify-center text-blue-900 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-md px-3 py-1 vibration-feedback-mimic scale-95 duration-150">
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: 'FILL' 1 }}>account_balance_wallet</span>
          <span className="font-inter text-[10px] font-semibold uppercase tracking-wider">Accounts</span>
        </button>
        <button className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:text-blue-700 transition-all vibration-feedback-mimic scale-95 duration-150">
          <span className="material-symbols-outlined mb-1">swap_horiz</span>
          <span className="font-inter text-[10px] font-semibold uppercase tracking-wider">Transfers</span>
        </button>
        <button className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 hover:text-blue-700 transition-all vibration-feedback-mimic scale-95 duration-150">
          <span className="material-symbols-outlined mb-1">verified_user</span>
          <span className="font-inter text-[10px] font-semibold uppercase tracking-wider">Security</span>
        </button>
      </nav>
    </div>
  );
}

export default App;
