import React from 'react';

export default function SuccessBanner({ auditData, onClose }) {
  if (!auditData) return null;

  return (
    <div className='bg-green-50 border-2 border-green-500 rounded-xl p-6 mb-6 shadow-sm relative overflow-hidden animate-fadeIn'>
      <div className='flex items-start gap-4'>
        <div className='p-2 bg-green-100 text-green-700 rounded-full'>
          <span className='material-symbols-outlined text-[28px]'>check_circle</span>
        </div>
        <div className='flex-1'>
          <h3 className='text-headline-sm font-bold text-green-900 mb-1'>Assortment Plan Submitted Successfully!</h3>
          <p className='text-body-md text-green-700 mb-4'>
            The assortment plan has been locked and sent to the downstream execution systems.
          </p>
          
          <div className='bg-white rounded-lg p-4 border border-green-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-body-sm text-secondary'>
            <div>
              <span className='block font-semibold text-green-900 uppercase tracking-wider text-[10px] mb-1'>Audit ID</span>
              <span className='font-data-mono text-on-background'>{auditData.audit_id}</span>
            </div>
            <div>
              <span className='block font-semibold text-green-900 uppercase tracking-wider text-[10px] mb-1'>Status</span>
              <span className='px-2 py-0.5 bg-green-100 text-green-800 rounded font-bold uppercase text-[10px]'>{auditData.status}</span>
            </div>
            <div>
              <span className='block font-semibold text-green-900 uppercase tracking-wider text-[10px] mb-1'>Timestamp</span>
              <span className='font-data-mono text-on-background'>{new Date(auditData.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className='text-green-700 hover:bg-green-100 p-1.5 rounded-full transition-colors'
          aria-label='Close banner'
        >
          <span className='material-symbols-outlined'>close</span>
        </button>
      </div>
    </div>
  );
}
