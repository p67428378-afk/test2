import React from 'react';

const PanInput = () => {
  return (
    <section className='col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-full p-8 shadow-sm'>
      <div className='flex justify-between items-start mb-6'>
        <div className='w-12 h-12 bg-primary-fixed flex items-center justify-center rounded-xl text-primary'>
          <span className='material-symbols-outlined'>badge</span>
        </div>
        <span className='flex items-center gap-1.5 px-3 py-1 bg-tertiary-fixed text-tertiary font-bold text-[10px] tracking-widest uppercase rounded-full'>
          <span className='material-symbols-outlined text-[14px]'>check_circle</span> Validated
        </span>
      </div>
      <h3 className='text-xl font-headline font-bold mb-6 text-blue-900'>PAN Validation</h3>
      <div className='space-y-6'>
        <div>
          <label className='block text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2'>Permanent Account Number</label>
          <input className='w-full bg-surface-container-low border-none rounded-xl px-4 py-3 font-mono text-on-surface uppercase focus:ring-2 focus:ring-primary/20 transition-all' disabled type='text' value='ABCDE1234F'/>
        </div>
        <div className='relative w-full aspect-[16/9] bg-surface-container-low rounded-xl overflow-hidden group/img'>
          <img alt='PAN Document View' className='w-full h-full object-cover opacity-60 grayscale' src='https://lh3.googleusercontent.com/aida-public/AB6AXuDB0JLqoH42cToC_-MVJSFJPMpLZ1Hh8U5YZ7J2aejtjD5vdSGbHpme6c0vOrdPwNMgtEEC3dOd7AEnLBlPRIcp0dA4vCAntJomGGaVDBClv79rAeumeRPWmK76q2wywAQ8qiS-uuZs80i2Xw2FHOko_Zedmj6uXDk6oAoNjz2Q3w19BsrZkeByUX0bjGGLLpi0Dl4yL4oGIf3y1SFpiM0JY6Q2LUiJp5K_6RjqoVQhDtcvuj84t0A5sIEGPesXBzMfjp6iKkhZ-fU'/>
          <div className='absolute inset-0 bg-blue-900/10 flex flex-col items-center justify-center text-primary'>
            <span className='material-symbols-outlined text-4xl'>visibility</span>
            <span className='text-[10px] font-bold uppercase mt-2'>View Document Scan</span>
          </div>
        </div>
        <div className='flex items-center gap-3 p-4 bg-surface-container-low rounded-xl border-l-4 border-tertiary'>
          <span className='material-symbols-outlined text-tertiary'>gpp_good</span>
          <div>
            <p className='text-[10px] font-bold text-on-surface-variant uppercase tracking-widest'>Database Match</p>
            <p className='text-sm font-semibold text-on-surface'>Verified against Income Tax Dept</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PanInput;
