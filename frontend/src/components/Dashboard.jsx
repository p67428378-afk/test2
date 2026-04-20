import React from 'react';

const Dashboard = () => {
  return (
    <div className='bg-surface text-on-surface min-h-screen pb-20'>
      <header className='docked full-width top-0 z-50 bg-[#f7f9fb] border-b border-[#004a96]/10 flex items-center justify-between px-6 py-3 w-full shadow-sm shadow-[#515f74]/5'>
        <div className='flex items-center gap-3'>
          <button className='hover:bg-[#e0e3e5] transition-colors scale-95 active:scale-90 transition-transform p-2 rounded-lg'>
            <span className='material-symbols-outlined text-[#004a96]'>menu</span>
          </button>
          <h1 className='text-lg font-black tracking-widest text-[#00346c] uppercase font-['Inter']'>Sentinel Ledger</h1>
        </div>
        <div className='flex items-center gap-2'>
          <button className='hover:bg-[#e0e3e5] transition-colors p-2 rounded-lg relative'>
            <span className='material-symbols-outlined text-[#515f74]'>notifications</span>
            <span className='absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface'></span>
          </button>
          <div className='w-8 h-8 rounded-full bg-primary-container flex items-center justify-center text-on-primary text-xs font-bold ring-2 ring-primary/10'>
            AU
          </div>
        </div>
      </header>
      <main className='px-6 pt-6 space-y-8 max-w-lg mx-auto'>
        <section className='space-y-4'>
          <div className='flex items-end justify-between'>
            <div>
              <span className='text-[10px] font-bold uppercase tracking-widest text-secondary font-label'>System Aggregate</span>
              <h2 className='text-3xl font-black text-primary leading-tight'>142.82 Cr</h2>
            </div>
            <span className='material-symbols-outlined text-primary/20 text-4xl' style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
          </div>
          <div className='grid grid-cols-2 gap-3'>
            <div className='bg-surface-container-low p-4 rounded-xl space-y-1'>
              <span className='text-[10px] font-bold text-secondary uppercase tracking-wider'>Allowed</span>
              <div className='text-xl font-bold text-primary'>128.4 Cr</div>
              <div className='flex items-center text-[10px] text-green-700 font-bold'>
                <span className='material-symbols-outlined text-sm mr-1'>trending_up</span> 8.2%
              </div>
            </div>
            <div className='bg-surface-container-low p-4 rounded-xl space-y-1'>
              <span className='text-[10px] font-bold text-secondary uppercase tracking-wider'>Held</span>
              <div className='text-xl font-bold text-primary'>14.30 Cr</div>
              <div className='flex items-center text-[10px] text-on-secondary-fixed-variant font-bold'>
                <span className='material-symbols-outlined text-sm mr-1'>pause_circle</span> Static
              </div>
            </div>
            <div className='bg-surface-container-low p-4 rounded-xl col-span-2 flex items-center justify-between'>
              <div>
                <span className='text-[10px] font-bold text-secondary uppercase tracking-wider'>Blocked Anomalies</span>
                <div className='text-2xl font-black text-error'>12</div>
              </div>
              <div className='bg-error-container p-2 rounded-lg'>
                <span className='material-symbols-outlined text-on-error-container'>security_update_warning</span>
              </div>
            </div>
          </div>
        </section>
        <section className='space-y-6'>
          <div className='flex items-center justify-between'>
            <h3 className='text-sm font-bold text-primary uppercase tracking-wider'>Real-time Feed</h3>
            <div className='flex gap-2'>
              <button className='p-1.5 rounded-lg bg-surface-container-high text-secondary'>
                <span className='material-symbols-outlined text-sm'>filter_list</span>
              </button>
              <button className='p-1.5 rounded-lg bg-surface-container-high text-secondary'>
                <span className='material-symbols-outlined text-sm'>search</span>
              </button>
            </div>
          </div>
          <div className='flex gap-2 overflow-x-auto hide-scrollbar -mx-2 px-2'>
            <button className='bg-primary text-on-primary px-4 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap'>STATUS: ALL</button>
            <button className='bg-surface-container-high text-secondary px-4 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap'>AMOUNT: &gt;₹1k</button>
            <button className='bg-surface-container-high text-secondary px-4 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap'>TODAY</button>
            <button className='bg-surface-container-high text-secondary px-4 py-1.5 rounded-full text-[10px] font-bold whitespace-nowrap'>VPA TYPE</button>
          </div>
          <div className='space-y-1'>
            <div className='group bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between transition-all active:scale-[0.98]'>
              <div className='flex items-center gap-4'>
                <div className='w-10 h-10 rounded-full bg-surface-container flex items-center justify-center'>
                  <span className='material-symbols-outlined text-secondary text-xl'>payments</span>
                </div>
                <div>
                  <p className='text-xs font-bold text-on-surface'>paytm.98221@okbizaxis</p>
                  <p className='text-[10px] text-secondary font-medium mt-0.5'>14:22:01 • ID: 772184</p>
                </div>
              </div>
              <div className='text-right'>
                <p className='text-sm font-bold text-on-surface'>₹4,500</p>
                <span className='inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-[9px] font-black uppercase mt-1'>ALLOW</span>
              </div>
            </div>
            <div className='group bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between transition-all active:scale-[0.98]'>
              <div className='flex items-center gap-4'>
                <div className='w-10 h-10 rounded-full bg-surface-container flex items-center justify-center'>
                  <span className='material-symbols-outlined text-secondary text-xl'>shopping_cart</span>
                </div>
                <div>
                  <p className='text-xs font-bold text-on-surface'>merchant.global@upi</p>
                  <p className='text-[10px] text-secondary font-medium mt-0.5'>14:21:45 • ID: 772183</p>
                </div>
              </div>
              <div className='text-right'>
                <p className='text-sm font-bold text-on-surface'>₹12,800</p>
                <span className='inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-[9px] font-black uppercase mt-1'>HOLD</span>
              </div>
            </div>
            <div className='group bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between transition-all active:scale-[0.98]'>
              <div className='flex items-center gap-4'>
                <div className='w-10 h-10 rounded-full bg-surface-container flex items-center justify-center'>
                  <span className='material-symbols-outlined text-error text-xl'>warning</span>
                </div>
                <div>
                  <p className='text-xs font-bold text-on-surface'>unknown.user@suspicious</p>
                  <p className='text-[10px] text-secondary font-medium mt-0.5'>14:20:12 • ID: 772182</p>
                </div>
              </div>
              <div className='text-right'>
                <p className='text-sm font-bold text-error'>₹25,000</p>
                <span className='inline-flex items-center px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-[9px] font-black uppercase mt-1'>BLOCK</span>
              </div>
            </div>
            <div className='group bg-surface-container-lowest p-4 rounded-xl flex items-center justify-between transition-all active:scale-[0.98]'>
              <div className='flex items-center gap-4'>
                <div className='w-10 h-10 rounded-full bg-surface-container flex items-center justify-center'>
                  <span className='material-symbols-outlined text-secondary text-xl'>account_balance_wallet</span>
                </div>
                <div>
                  <p className='text-xs font-bold text-on-surface'>salary.disb@corporate</p>
                  <p className='text-[10px] text-secondary font-medium mt-0.5'>14:18:55 • ID: 772181</p>
                </div>
              </div>
              <div className='text-right'>
                <p className='text-sm font-bold text-on-surface'>₹85,000</p>
                <span className='inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-[9px] font-black uppercase mt-1'>ALLOW</span>
              </div>
            </div>
          </div>
          <div className='relative h-32 w-full rounded-2xl overflow-hidden shadow-sm'>
            <img className='w-full h-full object-cover grayscale brightness-50' alt='Abstract dark stylized topographic map with blue glowing data points representing transaction locations in a network' src='https://lh3.googleusercontent.com/aida-public/AB6AXuBW9LI_z6yxQ05JJhROZ6VFCHLtxRl5Exwy3llRVpyUh5QGS_L8ANe7zMUP5_tpK7EL0kyc9b54fINZlwctEM1YE1jE_5VikYuO0GY1rD5MGWzQNCWSfrNy5tIrQBI6bzeJseMraW3qdxfqn1mi2r8UaUHTXqzha1YrLO7ITXptvtOTV4Fdt4TT12cFYj_6wuukwrbJyjDZr_BWK66Pd_j55SgCXvU55jNp6dTYZlYQStzj8JYciKgcitkVos1IziiCgb21XRjRAAo' />
            <div className='absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent'></div>
            <div className='absolute bottom-4 left-4'>
              <p className='text-[10px] font-bold text-white/60 uppercase tracking-widest'>Network Heatmap</p>
              <p className='text-white font-bold'>Western Corridor Active</p>
            </div>
          </div>
        </section>
      </main>
      <nav className='fixed bottom-0 w-full z-50 pb-safe bg-[#f7f9fb]/80 backdrop-blur-md border-t border-[#004a96]/10 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] flex justify-around items-center h-16 w-full px-2'>
        <button className='flex flex-col items-center justify-center text-[#004a96] bg-[#004a96]/5 rounded-xl px-3 py-1 transition-all duration-300 ease-in-out'>
          <span className='material-symbols-outlined' style={{ fontVariationSettings: "'FILL' 1" }}>analytics</span>
          <span className='font-['Inter'] text-[10px] font-medium tracking-wide uppercase mt-0.5'>Monitor</span>
        </button>
        <button className='flex flex-col items-center justify-center text-[#515f74] hover:text-[#00346c] transition-all duration-300 ease-in-out'>
          <span className='material-symbols-outlined'>receipt_long</span>
          <span className='font-['Inter'] text-[10px] font-medium tracking-wide uppercase mt-0.5'>Ledger</span>
        </button>
        <button className='flex flex-col items-center justify-center text-[#515f74] hover:text-[#00346c] transition-all duration-300 ease-in-out relative'>
          <span className='material-symbols-outlined'>security_update_warning</span>
          <span className='font-['Inter'] text-[10px] font-medium tracking-wide uppercase mt-0.5'>Alerts</span>
          <span className='absolute top-0 right-1 w-2 h-2 bg-error rounded-full'></span>
        </button>
        <button className='flex flex-col items-center justify-center text-[#515f74] hover:text-[#00346c] transition-all duration-300 ease-in-out'>
          <span className='material-symbols-outlined'>settings</span>
          <span className='font-['Inter'] text-[10px] font-medium tracking-wide uppercase mt-0.5'>Settings</span>
        </button>
      </nav>
      <div className='fixed bottom-20 right-6 z-40'>
        <button className='bg-primary text-on-primary w-14 h-14 rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center transition-transform active:scale-90'>
          <span className='material-symbols-outlined text-2xl'>add</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
