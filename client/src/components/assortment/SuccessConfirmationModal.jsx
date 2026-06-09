import React from 'react';

export default function SuccessConfirmationModal({ isOpen, auditTrail, onClose }) {
  if (!isOpen) return null;

  const summary = auditTrail?.summary || "Assortment for Small Town Value Cluster submitted successfully under the 'Balanced' scenario.";
  const submissionId = auditTrail?.submission_id || "sub-123456";
  const timestamp = auditTrail?.timestamp || new Date().toISOString();
  const userId = auditTrail?.user_id || "category.manager@dollargeneral.com";

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4'>
      <div className='bg-[#1E293B] border border-[#334155] rounded-xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in duration-200'>
        <div className='flex items-center gap-3 text-green-400'>
          <span className='material-symbols-outlined text-3xl'>check_circle</span>
          <h3 className='text-xl font-bold text-on-surface'>Assortment Plan Submitted</h3>
        </div>
        
        <div className='bg-[#0F172A] border border-[#334155] rounded-lg p-4 flex flex-col gap-3 text-sm'>
          <div className='flex flex-col gap-1'>
            <span className='text-xs text-on-surface-variant uppercase font-bold tracking-wider'>Audit Trail Summary</span>
            <p className='text-on-surface leading-relaxed'>{summary}</p>
          </div>
          
          <div className='h-px bg-[#334155]'></div>
          
          <div className='grid grid-cols-2 gap-2 text-xs font-data-mono'>
            <div>
              <span className='text-on-surface-variant block'>Submission ID</span>
              <span className='text-on-surface font-bold'>{submissionId}</span>
            </div>
            <div>
              <span className='text-on-surface-variant block'>Submitted By</span>
              <span className='text-on-surface font-bold truncate block' title={userId}>{userId}</span>
            </div>
            <div className='col-span-2 mt-1'>
              <span className='text-on-surface-variant block'>Timestamp</span>
              <span className='text-on-surface font-bold'>{new Date(timestamp).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className='w-full bg-[#6366F1] hover:bg-[#4f46e5] text-white font-bold py-2 px-4 rounded transition-colors text-sm'
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}