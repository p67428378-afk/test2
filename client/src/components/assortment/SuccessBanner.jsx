import React from 'react';

export default function SuccessBanner({ auditTrail, onClose }) {
  if (!auditTrail) return null;

  return (
    <div className='mb-lg bg-green-50 border border-green-200 rounded-lg p-md flex items-start gap-md shadow-sm'>
      <span className='material-symbols-outlined text-green-600 mt-1' style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
      <div className='flex-1'>
        <h3 className='font-bold text-green-800'>Assortment plan submitted successfully!</h3>
        <p className='text-sm text-green-700 mt-1 font-mono'>
          Transaction ID: {auditTrail.transaction_id} | Timestamp: {auditTrail.timestamp} | User: {auditTrail.user_email}
        </p>
      </div>
      <button onClick={onClose} className='text-green-600 hover:bg-green-100 p-1 rounded transition-colors'>
        <span className='material-symbols-outlined text-sm'>close</span>
      </button>
    </div>
  );
}
