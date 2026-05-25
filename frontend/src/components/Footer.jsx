
import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full py-8 mt-auto bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="flex flex-col md:flex-row justify-between items-center px-12 max-w-[1920px] mx-auto">
        <p className="text-slate-400 dark:text-slate-600 font-inter text-xs tracking-wide">© 2024 Architectural Authority Banking Corp. Secure Infrastructure.</p>
        <div className="flex gap-8 mt-4 md:mt-0">
          <a className="text-slate-400 dark:text-slate-600 font-inter text-xs tracking-wide hover:underline opacity-80" href="#">Privacy Policy</a>
          <a className="text-slate-400 dark:text-slate-600 font-inter text-xs tracking-wide hover:underline opacity-80" href="#">Terms of Service</a>
          <a className="text-slate-400 dark:text-slate-600 font-inter text-xs tracking-wide hover:underline opacity-80" href="#">Security Disclosure</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
