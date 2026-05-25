import React from 'react';

const EmploymentInfo = () => {
  return (
    <div className='bg-surface-container-low p-10 rounded-xl space-y-8'>
      <div className='flex items-center gap-3'>
        <span className='material-symbols-outlined text-primary'>business_center</span>
        <h3 className='text-xl font-headline font-semibold text-primary'>Employment Information</h3>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8'>
        <div className='space-y-2'>
          <label className='text-xs font-bold uppercase text-on-surface-variant tracking-wider'>Employer Name</label>
          <input className='w-full bg-transparent border-0 border-b-2 border-outline-variant/20 focus:border-primary focus:ring-0 px-0 py-2 text-lg font-medium transition-all' placeholder='Vertex Design Group' type='text' />
        </div>
        <div className='space-y-2'>
          <label className='text-xs font-bold uppercase text-on-surface-variant tracking-wider'>Job Title</label>
          <input className='w-full bg-transparent border-0 border-b-2 border-outline-variant/20 focus:border-primary focus:ring-0 px-0 py-2 text-lg font-medium transition-all' placeholder='Principal Architect' type='text' />
        </div>
        <div className='space-y-2'>
          <label className='text-xs font-bold uppercase text-on-surface-variant tracking-wider'>Work Address</label>
          <input className='w-full bg-transparent border-0 border-b-2 border-outline-variant/20 focus:border-primary focus:ring-0 px-0 py-2 text-lg font-medium transition-all' placeholder='Park Avenue, Suite 400, NY' type='text' />
        </div>
        <div className='space-y-2'>
          <label className='text-xs font-bold uppercase text-on-surface-variant tracking-wider'>Start Date</label>
          <input className='w-full bg-transparent border-0 border-b-2 border-outline-variant/20 focus:border-primary focus:ring-0 px-0 py-2 text-lg font-medium transition-all' type='date' />
        </div>
      </div>
    </div>
  );
};

export default EmploymentInfo;
