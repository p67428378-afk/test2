import React from 'react';

export default function Header() {
  return (
    <header className='bg-[#0F172A] fixed top-0 right-0 h-16 w-full md:w-[calc(100%-260px)] border-b border-[#334155] flex justify-between items-center px-8 z-30'>
      <div className='flex items-center gap-4'>
        <button className='md:hidden text-white'>
          <span className='material-symbols-outlined'>menu</span>
        </button>
        <h2 className='text-lg font-bold text-white truncate'>Small Town Value Cluster — Snacks Assortment Advisor</h2>
      </div>
      <div className='flex items-center gap-4'>
        <button className='text-[#d8c3ad] hover:text-[#F59E0B] transition-all p-2 rounded-full hover:bg-[#273647]'>
          <span className='material-symbols-outlined'>notifications</span>
        </button>
        <div className='w-8 h-8 rounded-full bg-[#273647] overflow-hidden border border-[#334155]'>
          <img
            alt='John Doe Avatar'
            className='w-full h-full object-cover'
            src='https://lh3.googleusercontent.com/aida-public/AB6AXuCfGY9O2KODEPYFtWdp9dBOSvThE-HBe3Pv9Lh7IJfq5KdcqrK6K8f5ZUfKkMSfSSu7n9zjt5L_oH99L1y8hmbYLzi5-I1CZI5wS5qIlUSokpK0v0SL4R391dEjLn550xShK_XpNjkvLkNJhptXCVb-6CvhhOHn-Eq0OscfY3LBuyr9zze9TGTZtOC8UMVPYZkz5vC8KxTYpsE2dAOQFmPbLmlasp6O2c-yvlyspLh73IWEubbHlpTy0MAn0oxtHi4BjKVlTha6-g'
          />
        </div>
      </div>
    </header>
  );
}
