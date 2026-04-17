import React from 'react';

const StatusIndicator = ({ status }) => {
  if (!status) {
    return (
      <section className='bg-surface-container-high rounded-xl p-1 overflow-hidden'>
        <div className='bg-surface-container-lowest rounded-[calc(0.75rem-4px)] p-8 flex flex-col items-center text-center'>
          <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-6'>Final Compliance Status</p>
          <div className='relative mb-8'>
            <div className='w-48 h-48 rounded-full border-8 border-gray-200 flex items-center justify-center'>
              <div className='w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center shadow-inner'>
                <span className="material-symbols-outlined text-6xl text-gray-400" data-icon="hourglass_empty">hourglass_empty</span>
              </div>
            </div>
          </div>
          <h3 className='font-headline text-5xl font-extrabold text-gray-400 tracking-tighter mb-2'>PENDING</h3>
          <p className='text-sm font-medium text-on-surface-variant mb-8 px-6'>Submit your documents to begin the verification process.</p>
        </div>
      </section>
    );
  }

  const isApproved = status === 'APPROVED';

  return (
    <section className={`rounded-xl p-1 overflow-hidden ${isApproved ? 'bg-tertiary/20' : 'bg-error/20'}`}>
      <div className='bg-surface-container-lowest rounded-[calc(0.75rem-4px)] p-8 flex flex-col items-center text-center'>
        <p className='text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant mb-6'>Final Compliance Status</p>
        <div className='relative mb-8'>
          <div className={`w-48 h-48 rounded-full border-8 ${isApproved ? 'border-tertiary/20' : 'border-error/20'} flex items-center justify-center`}>
            <div className={`w-40 h-40 rounded-full ${isApproved ? 'bg-tertiary' : 'bg-error'} flex items-center justify-center shadow-2xl ${isApproved ? 'shadow-tertiary/30' : 'shadow-error/30'}`}>
              <span className="material-symbols-outlined text-6xl text-white" data-icon={isApproved ? 'verified' : 'gpp_bad'} style={{fontVariationSettings: "'FILL' 1"}}>{isApproved ? 'verified' : 'gpp_bad'}</span>
            </div>
          </div>
          <div className='absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg'>
            <span className={`material-symbols-outlined ${isApproved ? 'text-tertiary' : 'text-error'} font-bold`} data-icon={isApproved ? 'done_all' : 'close'}>{isApproved ? 'done_all' : 'close'}</span>
          </div>
        </div>
        <h3 className={`font-headline text-5xl font-extrabold ${isApproved ? 'text-tertiary' : 'text-error'} tracking-tighter mb-2`}>{status}</h3>
        <p className='text-sm font-medium text-on-surface-variant mb-8 px-6'>
          {isApproved 
            ? 'Your institutional profile has been successfully validated against the central repository.'
            : 'Your profile has been flagged for manual review. Please check the audit log for details.'
          }
        </p>
        <div className='w-full pt-8 border-t border-outline-variant/20 flex flex-col gap-3'>
          <div className='flex justify-between items-center text-xs'>
            <span className='text-on-surface-variant'>Compliance ID</span>
            <span className='font-mono font-bold'>ARC-SENT-9981-X</span>
          </div>
          <div className='flex justify-between items-center text-xs'>
            <span className='text-on-surface-variant'>Expiry Date</span>
            <span className='font-mono font-bold'>24 OCT 2025</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatusIndicator;
