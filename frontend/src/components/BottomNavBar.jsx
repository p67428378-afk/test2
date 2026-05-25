import React from 'react';

const BottomNavBar = () => {
  return (
    <nav className='fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 pb-safe h-20 bg-[#ffffffcc] dark:bg-[#191c1ecc] backdrop-blur-xl shadow-[0_-1px_0_0_rgba(196,198,210,0.2)] rounded-t-xl'>
      <a className='flex flex-col items-center justify-center text-[#44474e] dark:text-[#c4c6d2] py-2 px-4 hover:bg-[#f2f4f6] dark:hover:bg-[#44474e] rounded-xl active:scale-90 transition-transform duration-200' href='#'>
        <span className='material-symbols-outlined'>home</span>
        <span className='font-['Inter'] text-[11px] font-medium tracking-wide uppercase mt-1'>Home</span>
      </a>
      <a className='flex flex-col items-center justify-center bg-[#002D72] text-white rounded-xl py-2 px-4 active:scale-90 transition-transform duration-200' href='#'>
        <span className='material-symbols-outlined' style={{fontVariationSettings: "'FILL' 1"}}>account_balance_wallet</span>
        <span className='font-['Inter'] text-[11px] font-medium tracking-wide uppercase mt-1'>Accounts</span>
      </a>
      <a className='flex flex-col items-center justify-center text-[#44474e] dark:text-[#c4c6d2] py-2 px-4 hover:bg-[#f2f4f6] dark:hover:bg-[#44474e] rounded-xl active:scale-90 transition-transform duration-200' href='#'>
        <span className='material-symbols-outlined'>payments</span>
        <span className='font-['Inter'] text-[11px] font-medium tracking-wide uppercase mt-1'>Pay</span>
      </a>
      <a className='flex flex-col items-center justify-center text-[#44474e] dark:text-[#c4c6d2] py-2 px-4 hover:bg-[#f2f4f6] dark:hover:bg-[#44474e] rounded-xl active:scale-90 transition-transform duration-200' href='#'>
        <span className='material-symbols-outlined'>trending_up</span>
        <span className='font-['Inter'] text-[11px] font-medium tracking-wide uppercase mt-1'>Wealth</span>
      </a>
      <a className='flex flex-col items-center justify-center text-[#44474e] dark:text-[#c4c6d2] py-2 px-4 hover:bg-[#f2f4f6] dark:hover:bg-[#44474e] rounded-xl active:scale-90 transition-transform duration-200' href='#'>
        <span className='material-symbols-outlined'>menu</span>
        <span className='font-['Inter'] text-[11px] font-medium tracking-wide uppercase mt-1'>Menu</span>
      </a>
    </nav>
  );
};

export default BottomNavBar;
