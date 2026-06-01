import React from 'react';

const Footer = () => {
  return (
    <footer className='bg-surface dark:bg-on-background border-t border-outline-variant/20 mt-auto'>
      <div className='flex flex-col md:flex-row justify-center items-center gap-stack-gap w-full py-section-gap px-margin-x max-w-container-max-width mx-auto'>
        <p className='font-caption text-caption text-on-surface-variant'>© 2026 My Todo App. Functional Clarity for daily focus.</p>
        <div className='flex gap-4'>
          <a className='font-caption text-caption text-on-surface-variant hover:text-primary transition-colors' href='#'>Privacy Policy</a>
          <a className='font-caption text-caption text-on-surface-variant hover:text-primary transition-colors' href='#'>Terms of Service</a>
          <a className='font-caption text-caption text-on-surface-variant hover:text-primary transition-colors' href='#'>Help Center</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
