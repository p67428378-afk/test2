import React from 'react';

export default function SuccessModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-[#d1c6ab]/50 animate-in fade-in zoom-in duration-200'>
        <div className='flex items-center gap-3 mb-4 text-[#10B981]'>
          <span className='material-symbols-outlined text-3xl' data-weight='fill'>check_circle</span>
          <h3 className='text-xl font-bold text-[#0b1c30]'>Assortment Plan Submitted</h3>
        </div>
        
        <p className='text-sm text-[#4d4632] mb-6'>
          Your assortment plan has been successfully processed and recorded in the audit trail.
        </p>

        <div className='bg-[#f8f9ff] rounded-lg p-4 mb-6 border border-[#d1c6ab]/30 space-y-3 font-mono text-xs text-[#4d4632]'>
          <div className='flex justify-between'>
            <span className='font-sans font-semibold text-[#0b1c30]'>Audit ID:</span>
            <span className='font-bold text-[#725c00]'>{data.audit_id}</span>
          </div>
          <div className='flex justify-between'>
            <span className='font-sans font-semibold text-[#0b1c30]'>Scenario:</span>
            <span>{data.scenario_name}</span>
          </div>
          <div className='flex justify-between'>
            <span className='font-sans font-semibold text-[#0b1c30]'>Status:</span>
            <span className='text-[#10B981] font-bold'>{data.status}</span>
          </div>
          <div className='flex justify-between'>
            <span className='font-sans font-semibold text-[#0b1c30]'>Submitted By:</span>
            <span className='truncate max-w-[180px]' title={data.submitted_by}>{data.submitted_by}</span>
          </div>
          <div className='flex justify-between'>
            <span className='font-sans font-semibold text-[#0b1c30]'>Submitted At:</span>
            <span>{new Date(data.submitted_at).toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className='w-full bg-[#ffd200] hover:bg-[#725c00] hover:text-white text-[#231b00] font-bold py-2.5 px-4 rounded-lg shadow-sm transition-colors duration-200 text-center uppercase tracking-wide text-xs'
        >
          Close
        </button>
      </div>
    </div>
  );
}
