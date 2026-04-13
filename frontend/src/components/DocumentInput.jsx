
import React from 'react';

const DocumentInput = () => {
  return (
    <div className='col-span-12 lg:col-span-8 bg-surface-container-lowest p-8 rounded-xl'>
      <div className='flex justify-between items-center mb-8'>
        <h3 className='text-[10px] font-headline uppercase tracking-[0.2em] text-on-surface-variant'>Identity Credentials</h3>
        <span className='text-xs font-semibold text-primary bg-primary-fixed px-3 py-1 rounded'>2/2 Documents Provided</span>
      </div>
      <div className='grid md:grid-cols-2 gap-10'>
        {/* Aadhaar Section */}
        <div className='space-y-6'>
          <div className='space-y-2'>
            <label className='block text-[10px] font-headline uppercase tracking-widest text-on-surface-variant'>Aadhaar Card Number</label>
            <input className='w-full bg-surface-container-low border-none p-4 font-mono text-lg text-primary focus:ring-0 focus:border-b-2 focus:border-primary transition-all' placeholder='0000 0000 0000' type='text' value='XXXX-XXXX-8821'/>
          </div>
          <div className='relative group'>
            <div className='absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center z-10 cursor-pointer'>
              <span className='bg-white px-4 py-2 rounded-full text-xs font-bold text-primary shadow-xl'>Replace Image</span>
            </div>
            <img className='w-full aspect-video object-cover rounded-lg bg-surface-bright' src='https://lh3.googleusercontent.com/aida-public/AB6AXuDAwIbYQhf6hoaiy082aKqpwuy6OkFZ4PAJz84mSKCTV9mDqXieGOFkAFLCurfVtxzM00YxKa3o2Bk6Ix2AIeP6V0ov9oXWTLo76zEJNNTJWmYhtL8CtLh3z8KObRoSOMyUq__92oM7ZXgIj1dX-krMHLxpHhfH3q41r92NK0HR4rHBIX_9uY24LhO3O859_pYVTxQd8oK6vi_V5a0VIbG6O7rzTFJ5HozMZ0OMmaS69gXEB-ZOLQ_sgFhixzN-T2E716lWrRK77yc'/>
            <div className='mt-3 flex justify-between items-center'>
              <span className='text-xs text-on-surface-variant'>aadhaar_front_v1.jpg (2.4 MB)</span>
              <span className='material-symbols-outlined text-primary cursor-pointer'>check_circle</span>
            </div>
          </div>
        </div>
        {/* PAN Section */}
        <div className='space-y-6'>
          <div className='space-y-2'>
            <label className='block text-[10px] font-headline uppercase tracking-widest text-on-surface-variant'>PAN Card Number</label>
            <input className='w-full bg-surface-container-low border-none p-4 font-mono text-lg text-primary focus:ring-0 focus:border-b-2 focus:border-primary transition-all' placeholder='ABCDE1234F' type='text' value='ABCDE1234F'/>
          </div>
          <div className='relative group'>
            <div className='absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center z-10 cursor-pointer'>
              <span className='bg-white px-4 py-2 rounded-full text-xs font-bold text-primary shadow-xl'>Replace Image</span>
            </div>
            <img className='w-full aspect-video object-cover rounded-lg bg-surface-bright' src='https://lh3.googleusercontent.com/aida-public/AB6AXuA4PJTSC5fqxQAS2Sz9eFRn6Xz7vrwThGNhqcT30liZJNMAp9EeuXBvzEe0-om0zZli4GURAbmSWW3XO6_G9Pfpa0pLWx6Yomd1MVKrLuMTET-N8S18PPWfm9KXaBI0F1f5lgWe-sR0VpRJuGSRvHmsDJ0zcdtQKFwIRJfRNe3bw6dKPMdw-GrNV_c3ptdYQ105DjDtg-v04B0dWVMQE8lCUMeaddo_Po2C91y0S6Z0Zv2hCZtvL3f5aD74xEomPTvwwr0ES_NZnH0'/>
            <div className='mt-3 flex justify-between items-center'>
              <span className='text-xs text-on-surface-variant'>pan_card_main.png (1.8 MB)</span>
              <span className='material-symbols-outlined text-primary cursor-pointer'>check_circle</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentInput;
