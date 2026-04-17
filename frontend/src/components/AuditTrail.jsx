import React from 'react';

function AuditTrail() {
  const auditLogs = [
    {
      timestamp: 'OCT 24, 2023 · 14:22:10',
      status: 'SYSTEM_AUTO',
      message: 'Biometric Integrity Check Passed',
      icon: 'verified',
      color: 'tertiary'
    },
    {
      timestamp: 'OCT 24, 2023 · 14:18:05',
      status: 'OCR_ENGINE_V4',
      message: 'Aadhaar OCR Data Extraction Completed',
      icon: 'verified',
      color: 'tertiary'
    },
    {
      timestamp: 'OCT 24, 2023 · 14:15:30',
      status: 'IP_GATEWAY',
      message: 'Session Initialized: SEC_ID_77821',
      icon: 'info',
      color: 'primary'
    },
    {
      timestamp: 'OCT 24, 2023 · 14:14:59',
      status: 'REJECTED',
      message: 'Previous PAN Verification Failed: Blurred Image',
      icon: 'error',
      color: 'error'
    }
  ];

  return (
    <section className='col-span-2 bg-surface-container-lowest p-8 rounded-xl shadow-sm'>
      <div className='flex items-center justify-between mb-8'>
        <h2 className='font-headline font-bold text-lg'>Verification Audit Trail</h2>
        <button className='text-[10px] font-bold uppercase tracking-widest text-primary hover:underline'>Download Full Log</button>
      </div>
      <div className='space-y-0'>
        {auditLogs.map((log, index) => (
          <div key={index} className='grid grid-cols-12 gap-4 py-4 border-b border-outline-variant/10 items-center'>
            <div className='col-span-3 text-xs font-bold text-on-surface-variant'>{log.timestamp}</div>
            <div className='col-span-1 flex justify-center'><span className={`w-2 h-2 rounded-full bg-${log.color}`}></span></div>
            <div className='col-span-5 text-sm font-medium'>{log.message}</div>
            <div className='col-span-3 text-right'><span className={`text-[10px] font-bold bg-${log.color}/10 text-on-${log.color}-container px-2 py-1 rounded`}>{log.status}</span></div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default AuditTrail;
