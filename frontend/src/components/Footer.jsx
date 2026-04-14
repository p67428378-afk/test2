import React from 'react';

const Footer = () => {
  return (
    <footer className='mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4'>
      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-1 bg-surface-container px-3 py-1 rounded-full text-[10px] font-bold text-on-surface-variant'>
          <span className='material-symbols-outlined text-xs'>cloud_done</span>
          System Status: Protected
        </div>
        <p className='text-xs text-slate-400'>© 2024 Sovereign Health & Life Insurance. All rights reserved.</p>
      </div>
      <div className='flex gap-6 text-xs font-bold text-primary'>
        <a href='#' className='hover:underline'>Privacy Policy</a>
        <a href='#' className='hover:underline'>Terms of Service</a>
        <a href='#' className='hover:underline'>Contact Support</a>
      </div>
    </footer>
  );
};

export default Footer;
