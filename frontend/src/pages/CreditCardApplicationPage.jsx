import React from 'react';
import ApplicationForm from '../components/ApplicationForm';

const CreditCardApplicationPage = () => {
  return (
    <main className='max-w-7xl mx-auto px-6 py-12 lg:py-20 flex flex-col items-center'>
      <div className='w-full max-w-3xl mb-10 text-center md:text-left'>
        <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight text-on-background mb-3'>Apply for a Credit Card</h1>
        <p className='text-on-surface-variant text-lg'>Please fill out the form below to apply.</p>
      </div>
      <ApplicationForm />
      <div className='w-full max-w-3xl mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
        <div className='space-y-4'>
          <h3 className='text-2xl font-bold tracking-tight'>The Architect's Ledger Signature</h3>
          <p className='text-on-surface-variant'>Gain access to exclusive premium benefits, including 3% cashback on architectural and design software, unlimited lounge access, and world-class fraud protection.</p>
        </div>
        <div className='relative group h-48 rounded-2xl primary-gradient p-6 flex flex-col justify-between overflow-hidden shadow-2xl scale-105 md:rotate-3 hover:rotate-0 transition-transform duration-500'>
          <div className='absolute inset-0 bg-white/5 pointer-events-none'></div>
          <div className='absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl'></div>
          <div className='flex justify-between items-start'>
            <div className='flex flex-col'>
              <span className='text-[10px] uppercase tracking-widest text-primary-fixed-dim opacity-70'>Signature Card</span>
              <div className='flex gap-1 mt-2'>
                <div className='w-8 h-6 bg-tertiary-fixed-dim/40 rounded-sm'></div>
              </div>
            </div>
            <span className='material-symbols-outlined text-white/80'>contactless</span>
          </div>
          <div className='space-y-4'>
            <div className='text-xl font-mono text-white/90 tracking-[0.2em]'>•••• •••• •••• 8842</div>
            <div className='flex justify-between items-end'>
              <div className='flex flex-col'>
                <span className='text-[8px] uppercase tracking-widest text-primary-fixed-dim opacity-70'>Card Holder</span>
                <span className='text-sm font-bold text-white tracking-wide uppercase'>Jane Doe</span>
              </div>
              <div className='h-8 w-12 bg-white/10 rounded backdrop-blur-md border border-white/20 flex items-center justify-center italic font-black text-white/40 text-[8px]'>
                VISA
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CreditCardApplicationPage;
