
import React from 'react';

const Results = ({ result }) => {
  if (!result) {
    return null;
  }

  const isEligible = result.eligibility_status === 'Eligible';

  return (
    <section className='space-y-4'>
      <div className='flex items-center gap-2 px-1'>
        <span className='material-symbols-outlined text-primary text-xl'>fact_check</span>
        <h3 className='font-headline font-bold text-lg'>Preliminary Analysis</h3>
      </div>

      {isEligible ? (
        <div className='bg-primary-container text-on-primary rounded-xl overflow-hidden relative'>
          <div className='absolute top-0 right-0 p-4 md:p-8 opacity-10'>
            <span className='material-symbols-outlined text-6xl md:text-9xl' style={{fontVariationSettings: '\'FILL\' 1'}}>verified</span>
          </div>
          <div className='p-6 relative z-10'>
            <div className='flex items-center gap-3 mb-6'>
              <div className='w-10 h-10 rounded-full bg-white/20 flex items-center justify-center'>
                <span className='material-symbols-outlined text-white' style={{fontVariationSettings: '\'FILL\' 1'}}>check_circle</span>
              </div>
              <div>
                <p className='text-on-primary-container text-[10px] font-bold uppercase tracking-widest'>Eligibility Status</p>
                <p className='text-white font-headline font-extrabold text-xl'>{result.eligibility_status}</p>
              </div>
            </div>
            <div className='bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/10'>
              <p className='text-on-primary-container text-[10px] font-bold uppercase tracking-widest mb-1'>Personalized Interest Rate</p>
              <div className='flex items-baseline gap-2'>
                <p className='text-3xl font-headline font-black text-white'>{result.interest_rate}%</p>
                <p className='text-white/60 text-sm font-medium'>APR</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className='bg-error-container/30 rounded-xl p-6 border-l-4 border-error space-y-4'>
          <div className='flex items-center gap-3'>
            <span className='material-symbols-outlined text-error' style={{fontVariationSettings: '\'FILL\' 1'}}>warning</span>
            <h4 className='font-headline font-bold text-error'>Decision Detail</h4>
          </div>
          <p className='text-on-surface-variant text-sm'>Our automated system identified the following constraints for the requested Tier 1 financing:</p>
          <ul className='space-y-3'>
            {result.ineligibility_reasons.map((reason, index) => (
              <li key={index} className='flex items-start gap-3'>
                <span className='material-symbols-outlined text-error text-lg'>cancel</span>
                <span className='text-on-surface-variant text-xs font-medium'>{reason}</span>
              </li>
            ))}
          </ul>
          <div className='pt-2'>
            <button className='text-error font-bold text-sm underline decoration-2 underline-offset-4'>Talk to a Financial Officer</button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Results;
