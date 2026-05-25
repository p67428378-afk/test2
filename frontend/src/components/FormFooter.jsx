import React from 'react';

const FormFooter = () => {
  return (
    <footer className='flex items-center justify-between pt-8 border-t border-outline-variant/20'>
      <div className='flex items-center gap-4'>
        <span className='material-symbols-outlined text-on-surface-variant'>verified_user</span>
        <p className='text-sm text-on-surface-variant leading-tight'>Your data is secured with bank-grade <br />256-bit encryption.</p>
      </div>
      <div className='flex items-center gap-6'>
        <button className='text-on-surface-variant font-bold hover:text-primary transition-colors'>Save for Later</button>
        <button className='px-10 py-4 bg-primary text-on-primary font-bold rounded-md shadow-2xl shadow-primary/40 hover:translate-y-[-2px] transition-all'>Submit Application</button>
      </div>
    </footer>
  );
};

export default FormFooter;
