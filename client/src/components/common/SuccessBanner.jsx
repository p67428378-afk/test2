import React from 'react';

export default function SuccessBanner({ auditData, onClose }) {
  if (!auditData) return null;

  return (
    <div className='bg-green-50 border-2 border-green-500 rounded-xl p-6 mb-stack-lg shadow-md relative overflow-hidden animate-fade-in'>
      <div className='flex items-start gap-4'>
        <span className='material-symbols-outlined text-green-600 text-[32px]'>check_circle</span>
        <div className='flex-1'>
          <h3 className='text-headline-sm font-bold text-green-800 mb-1'>Assortment Plan Submitted Successfully!</h3>
          <p className='text-body-md text-green-700 mb-4'>
            The Small Town Value Cluster assortment plan has been locked and sent for downstream execution.
          </p>
          <div className='bg-white rounded-lg p-4 border border-green-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-body-sm text-secondary'>
            <div>
              <span className='font-semibold text-on-surface block'>Audit ID</span>
              <span className='font-mono text-xs'>{auditData.audit_id}</span>
            </div>
            <div>
              <span className='font-semibold text-on-surface block'>Status</span>
              <span className='text-green-700 font-bold uppercase'>{auditData.status}</span>
            </div>
            <div>
              <span className='font-semibold text-on-surface block'>Timestamp</span>
              <span>{new Date(auditData.timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className='text-green-700 hover:bg-green-100 p-1.5 rounded-full transition-colors'
          aria-label='Close confirmation'
        >
          <span className='material-symbols-outlined'>close</span>
        </button>
      </div>
    </div>
  );
}
