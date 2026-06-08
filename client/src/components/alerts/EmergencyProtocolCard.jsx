import React from 'react';

export default function EmergencyProtocolCard({ alert = null }) {
  if (!alert) {
    return (
      <section className='bento-card p-md rounded-lg flex flex-col justify-center items-center text-on-surface-variant min-h-[200px]'>
        <span className='material-symbols-outlined text-3xl mb-xs'>shield</span>
        <p className='font-body-sm text-body-sm text-center'>Select an alert to view its emergency response protocol.</p>
      </section>
    );
  }

  return (
    <section className='bento-card p-md rounded-lg flex flex-col gap-md border-error/30 bg-error-container/5'>
      <div className='flex items-center gap-sm text-error'>
        <span className='material-symbols-outlined'>emergency_home</span>
        <h3 className='font-title-sm text-title-sm font-bold'>Emergency Protocol: {alert.location}</h3>
      </div>
      <p className='font-body-sm text-body-sm text-on-surface-variant'>
        A critical leak has been detected at <strong>{alert.location}</strong>. Follow the standard operating procedures immediately:
      </p>
      <ol className='list-decimal list-inside space-y-sm font-body-sm text-on-surface'>
        <li>Isolate the affected pipeline segment by closing the upstream valve.</li>
        <li>Dispatch the emergency response crew to the coordinates.</li>
        <li>Notify local authorities and community managers in the vicinity.</li>
        <li>Monitor pressure readings on adjacent segments to prevent cascading failures.</li>
      </ol>
      <div className='mt-md p-sm bg-error-container/10 border border-error/20 rounded flex items-center gap-sm'>
        <span className='material-symbols-outlined text-error'>phone_in_talk</span>
        <div className='flex-1'>
          <p className='font-body-sm font-bold text-on-surface'>Emergency Dispatch Hotline</p>
          <p className='font-label-mono text-[10px] text-error'>+1 (800) 555-PIPE</p>
        </div>
      </div>
    </section>
  );
}
