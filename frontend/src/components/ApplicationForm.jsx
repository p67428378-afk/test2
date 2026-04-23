import React from 'react';

const ApplicationForm = () => {
  return (
    <div className='w-full max-w-3xl bg-surface-container-lowest rounded-xl p-8 md:p-12 card-ambient relative overflow-hidden'>
      <div className='absolute top-0 left-0 w-1 h-full bg-primary'></div>
      <form className='space-y-10'>
        <section>
          <div className='flex items-center gap-2 mb-6'>
            <span className='text-xs font-bold uppercase tracking-[0.05em] text-primary'>01</span>
            <h2 className='text-sm font-bold uppercase tracking-[0.05em] text-on-surface-variant'>Personal Identity</h2>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='space-y-2'>
              <label className='block text-xs font-bold uppercase tracking-[0.05em] text-on-surface-variant'>Full Name</label>
              <input className='w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all text-on-surface outline-none' placeholder='John Doe' type='text' defaultValue='Jane Doe'/>
            </div>
            <div className='space-y-2'>
              <label className='block text-xs font-bold uppercase tracking-[0.05em] text-on-surface-variant'>Date of Birth</label>
              <div className='relative'>
                <input className='w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all text-on-surface outline-none date-input-padding-fix' type='date' defaultValue='1990-05-15'/>
                <span className='material-symbols-outlined text-on-surface-variant absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none'>calendar_today</span>
              </div>
            </div>
            <div className='space-y-2 md:col-span-2'>
              <label className='block text-xs font-bold uppercase tracking-[0.05em] text-on-surface-variant'>Social Security Number (SSN)</label>
              <div className='relative'>
                <input className='w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all text-on-surface outline-none tracking-widest' placeholder='XXX-XX-XXXX' type='password' defaultValue='123-45-6789'/>
                <div className='absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-on-surface-variant/80'>
                  <span className='material-symbols-outlined text-sm'>lock</span>
                  <span className='text-xs font-medium'>Your data is encrypted.</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className='flex items-center gap-2 mb-6'>
            <span className='text-xs font-bold uppercase tracking-[0.05em] text-primary'>02</span>
            <h2 className='text-sm font-bold uppercase tracking-[0.05em] text-on-surface-variant'>Residency Details</h2>
          </div>
          <div className='space-y-2'>
            <label className='block text-xs font-bold uppercase tracking-[0.05em] text-on-surface-variant'>Current Address</label>
            <input className='w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all text-on-surface outline-none' type='text' defaultValue='456 Oak Ave, Cityville, State, 12345'/>
          </div>
        </section>
        <section>
          <div className='flex items-center gap-2 mb-6'>
            <span className='text-xs font-bold uppercase tracking-[0.05em] text-primary'>03</span>
            <h2 className='text-sm font-bold uppercase tracking-[0.05em] text-on-surface-variant'>Financial Profile</h2>
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='space-y-2'>
              <label className='block text-xs font-bold uppercase tracking-[0.05em] text-on-surface-variant'>Employment Status</label>
              <select className='w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-.all text-on-surface outline-none appearance-none'>
                <option value='employed'>Employed</option>
                <option value='unemployed'>Unemployed</option>
                <option value='student'>Student</option>
                <option value='retired'>Retired</option>
              </select>
            </div>
            <div className='space-y-2'>
              <label className='block text-xs font-bold uppercase tracking-[0.05em] text-on-surface-variant'>Annual Income ($)</label>
              <input className='w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all text-on-surface outline-none' type='number' defaultValue='85000'/>
            </div>
            <div className='space-y-2 md:col-span-2'>
              <label className='block text-xs font-bold uppercase tracking-[0.05em] text-on-surface-variant'>Estimated Credit Score</label>
              <div className='flex items-center gap-4'>
                <input className='w-32 bg-surface-container-highest border-none rounded-lg px-4 py-3 focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all text-on-surface outline-none font-bold text-xl' type='number' defaultValue='730'/>
                <div className='flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden'>
                  <div className='h-full primary-gradient w-[73%]'></div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className='hidden bg-error-container p-4 rounded-lg flex items-start gap-3'>
          <span className='material-symbols-outlined text-error'>error</span>
          <div className='text-on-error-container text-sm'>
            <p className='font-bold'>Validation Error</p>
            <p>Please check the highlighted fields and try again.</p>
          </div>
        </div>
        <div className='pt-6 border-t border-outline-variant/10'>
          <button className='w-full primary-gradient text-white font-bold py-4 rounded-lg transition-transform active:scale-[0.98] shadow-lg shadow-primary/20 flex justify-center items-center gap-2 group' type='submit'>
            Submit Application
            <span className='material-symbols-outlined group-hover:translate-x-1 transition-transform'>arrow_forward</span>
          </button>
          <p className='text-center mt-4 text-xs text-on-surface-variant'>By clicking submit, you agree to our <a className='text-primary underline' href='#'>Terms of Service</a> and Privacy Policy.</p>
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;
