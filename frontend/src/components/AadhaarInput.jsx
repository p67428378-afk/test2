import React from 'react';

const AadhaarInput = () => {
  return (
    <section className='col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-full p-8 shadow-sm group'>
      <div className='flex justify-between items-start mb-6'>
        <div className='w-12 h-12 bg-primary-fixed flex items-center justify-center rounded-xl text-primary'>
          <span className='material-symbols-outlined'>fingerprint</span>
        </div>
        <span className='flex items-center gap-1.5 px-3 py-1 bg-tertiary-fixed text-tertiary font-bold text-[10px] tracking-widest uppercase rounded-full'>
          <span className='material-symbols-outlined text-[14px]'>check_circle</span> Validated
        </span>
      </div>
      <h3 className='text-xl font-headline font-bold mb-6 text-blue-900'>Aadhaar Verification</h3>
      <div className='space-y-6'>
        <div>
          <label className='block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2'>Aadhaar Number</label>
          <input className='w-full bg-surface-container-low border-none rounded-xl px-4 py-3 font-mono text-on-surface focus:ring-2 focus:ring-primary/20 transition-all' disabled type='text' value='XXXX XXXX 8821'/>
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <div className='relative aspect-[3/2] bg-surface-container-low rounded-xl overflow-hidden group/img'>
            <img alt='Identity Document Front' className='w-full h-full object-cover opacity-60 grayscale group-hover/img:grayscale-0 transition-all duration-500' src='https://lh3.googleusercontent.com/aida-public/AB6AXuBIxgp6iX9DGBahh2tC4DgYTHD1Yxlk8skvu3LEYAx2exCyZJ2a-IyjEyJk_dqqhddwxq5j8BWad9P7N1W8PMi1TynQtPcQYk2R4aSN411JjrYD3UQ6YV7817KQ41QB6yxyjgJfwfLTwbc6mqJ4N3rsMqqiMZlW5VLHvw2H7nd2X2HlCvQiuVEvlSSSfG0v5rV9i-WVsDJwXVPW6wg-pm-snmUEWYRXI_DTXEWVq-RrEyLBo1o2mIq4aUKDM2m7A4os-bV8PfFlweg'/>
            <div className='absolute inset-0 bg-blue-900/10 flex flex-col items-center justify-center text-primary'>
              <span className='material-symbols-outlined text-3xl'>task</span>
              <span className='text-[10px] font-bold uppercase mt-1'>Front Side</span>
            </div>
          </div>
          <div className='relative aspect-[3/2] bg-surface-container-low rounded-xl overflow-hidden group/img'>
            <img alt='Identity Document Back' className='w-full h-full object-cover opacity-60 grayscale group-hover/img:grayscale-0 transition-all duration-500' src='https://lh3.googleusercontent.com/aida-public/AB6AXuCn65izShIDKVGhM6ehnxUtF47tBo3JL_DDA7AFARRUIhL8xDNx00dnJpyPjV_NCqoB0cxlo3bBWg_09BhRSEKQGoubDWGAxd8sEkiAviqn4g29WlABZSBUZROOWXLwtVJX7uEHJdzMFP9ezlKzkL7v2QAP6XaUA-xfPheuFUGY2GISmqvaKOwk3jNHbgpbsG8qtRGw7DvVxknguliUINuxxm9BEAK9GtGlKHfFmikNTvAbk1Y_P4uD3X48UtiOwavRDL-3WMl8bh8'/>
            <div className='absolute inset-0 bg-blue-900/10 flex flex-col items-center justify-center text-primary'>
              <span className='material-symbols-outlined text-3xl'>task</span>
              <span className='text-[10px] font-bold uppercase mt-1'>Back Side</span>
            </div>
          </div>
        </div>
        <button className='w-full py-3 text-sm font-bold text-primary border border-primary/20 rounded-xl hover:bg-primary-fixed transition-all'>
          Update Documents
        </button>
      </div>
    </section>
  );
};

export default AadhaarInput;
