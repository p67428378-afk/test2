import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className='h-16 fixed top-0 right-0 z-40 bg-surface border-b border-outline-variant flex items-center justify-between px-6 w-[calc(100%-260px)]'>
      <div className='flex items-center gap-2 w-1/3'>
        <div className='relative w-full max-w-md'>
          <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]'>search</span>
          <input
            className='w-full bg-[#0F172A] border-[#334155] border text-on-surface rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] font-body-md text-body-md transition-all'
            placeholder='Search manuscripts...'
            type='text'
          />
        </div>
      </div>
      <div className='flex items-center gap-4'>
        <button className='relative p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full scale-95 active:scale-90 transition-transform'>
          <span className='material-symbols-outlined'>notifications</span>
          <span className='absolute top-1 right-1 bg-error text-on-error-container text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center'>2</span>
        </button>
        <button
          onClick={() => navigate('/submit')}
          className='bg-[#6366F1] hover:bg-opacity-90 text-white font-label-md text-label-md font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors shadow-sm'
        >
          <span className='material-symbols-outlined text-[18px]'>add</span>
          New Submission
        </button>
      </div>
    </header>
  );
}
