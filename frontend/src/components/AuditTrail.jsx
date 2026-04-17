import React from 'react';

const AuditTrail = ({ auditTrail }) => {
  return (
    <section className='col-span-2 bg-surface-container-lowest p-8 rounded-xl shadow-sm'>
      <div className='flex items-center justify-between mb-8'>
        <h2 className='font-headline font-bold text-lg'>Verification Audit Trail</h2>
        <button className='text-[10px] font-bold uppercase tracking-widest text-primary hover:underline'>Download Full Log</button>
      </div>
      <div className='space-y-0'>
        {auditTrail.length > 0 ? (
          auditTrail.map((item, index) => (
            <div key={index} className='grid grid-cols-12 gap-4 py-4 border-b border-outline-variant/10 items-center'>
              <div className='col-span-3 text-xs font-bold text-on-surface-variant'>{new Date(item.timestamp).toLocaleString()}</div>
              <div className='col-span-1 flex justify-center'><span className={`w-2 h-2 rounded-full ${item.activity.includes('failed') || item.activity.includes('FLAGGED') ? 'bg-error' : 'bg-tertiary-fixed-dim'}`}></span></div>
              <div className='col-span-5 text-sm font-medium'>{item.activity}</div>
              <div className='col-span-3 text-right'><span className={`text-[10px] font-bold ${item.activity.includes('failed') || item.activity.includes('FLAGGED') ? 'bg-error-container text-on-error-container' : 'bg-tertiary/10 text-on-tertiary-container'} px-2 py-1 rounded`}>{item.activity.includes('failed') || item.activity.includes('FLAGGED') ? 'FLAGGED' : 'SYSTEM_AUTO'}</span></div>
            </div>
          ))
        ) : (
          <div className='text-center py-8 text-on-surface-variant'>No audit trail data yet.</div>
        )}
      </div>
    </section>
  );
};

export default AuditTrail;
