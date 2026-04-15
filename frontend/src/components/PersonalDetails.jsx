import React from 'react';

const PersonalDetails = () => {
  return (
    <div className='bg-surface-container-low p-10 rounded-xl space-y-8'>
      <div className='flex items-center gap-3'>
        <span className='material-symbols-outlined text-primary'>person</span>
        <h3 className='text-xl font-headline font-semibold text-primary'>Personal Details</h3>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8'>
        <div className='space-y-2'>
          <label className='text-xs font-bold uppercase text-on-surface-variant tracking-wider'>Full Name</label>
          <input className='w-full bg-transparent border-0 border-b-2 border-outline-variant/20 focus:border-primary focus:ring-0 px-0 py-2 text-lg font-medium transition-all' placeholder='e.g. Julian Vance' type='text' />
        </div>
        <div className='space-y-2'>
          <label className='text-xs font-bold uppercase text-on-surface-variant tracking-wider'>Email Address</label>
          <input className='w-full bg-transparent border-0 border-b-2 border-outline-variant/20 focus:border-primary focus:ring-0 px-0 py-2 text-lg font-medium transition-all' placeholder='julian.vance@vault.com' type='email' />
        </div>
        <div className='space-y-2'>
          <label className='text-xs font-bold uppercase text-on-surface-variant tracking-wider'>Phone Number</label>
          <input className='w-full bg-transparent border-0 border-b-2 border-outline-variant/20 focus:border-primary focus:ring-0 px-0 py-2 text-lg font-medium transition-all' placeholder='+1 (555) 000-0000' type='tel' />
        </div>
        <div className='space-y-2'>
          <label className='text-xs font-bold uppercase text-on-surface-variant tracking-wider'>Home Address</label>
          <input className='w-full bg-transparent border-0 border-b-2 border-outline-variant/20 focus:border-primary focus:ring-0 px-0 py-2 text-lg font-medium transition-all' placeholder='123 Architectural Way, NY' type='text' />
        </div>
      </div>
    </div>
  );
};

export default PersonalDetails;
