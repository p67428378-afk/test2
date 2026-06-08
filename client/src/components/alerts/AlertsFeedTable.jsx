import React from 'react';

export default function AlertsFeedTable({ alerts = [], onAcknowledge, onViewProtocol }) {
  return (
    <section className='col-span-12 bento-card rounded-lg flex flex-col mb-xl'>
      <div className='p-md border-b border-outline-variant flex justify-between items-center'>
        <h3 className='font-title-sm text-title-sm text-on-surface'>Live Gas Leak Alerts Feed</h3>
        <button className='text-primary font-label-mono text-label-mono flex items-center gap-xs hover:underline'>
          <span className='material-symbols-outlined text-[16px]'>download</span> EXPORT LOGS
        </button>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full text-left'>
          <thead className='bg-surface-container-low'>
            <tr>
              <th className='px-md py-sm font-label-mono text-label-mono text-on-surface-variant'>Alert ID</th>
              <th className='px-md py-sm font-label-mono text-label-mono text-on-surface-variant'>Sensor ID</th>
              <th className='px-md py-sm font-label-mono text-label-mono text-on-surface-variant'>Location</th>
              <th className='px-md py-sm font-label-mono text-label-mono text-on-surface-variant'>Severity</th>
              <th className='px-md py-sm font-label-mono text-label-mono text-on-surface-variant'>Status</th>
              <th className='px-md py-sm font-label-mono text-label-mono text-on-surface-variant text-right'>Action</th>
            </tr>
          </thead>
          <tbody className='divide-y divide-outline-variant/30'>
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <tr key={alert.id} className='hover:bg-surface-container-low/30 transition-colors h-[40px]'>
                  <td className='px-md py-sm font-label-mono text-body-sm text-on-surface'>{alert.id.substring(0, 8)}</td>
                  <td className='px-md py-sm font-label-mono text-body-sm text-on-surface'>{alert.sensor_id ? alert.sensor_id.substring(0, 8) : 'N/A'}</td>
                  <td className='px-md py-sm font-body-sm text-on-surface'>{alert.location}</td>
                  <td className='px-md py-sm'>
                    <span className={`inline-flex items-center gap-xs px-sm py-xs rounded text-[10px] font-bold uppercase ${
                      alert.severity === 'critical'
                        ? 'bg-error-container text-on-error-container'
                        : alert.severity === 'moderate'
                        ? 'bg-tertiary-container text-on-tertiary-container'
                        : 'bg-secondary-container text-on-secondary-container'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        alert.severity === 'critical' ? 'bg-error' : alert.severity === 'moderate' ? 'bg-tertiary' : 'bg-secondary'
                      }`}></span>
                      {alert.severity}
                    </span>
                  </td>
                  <td className='px-md py-sm font-body-sm italic text-on-surface-variant capitalize'>{alert.status}</td>
                  <td className='px-md py-sm text-right space-x-sm'>
                    {alert.status === 'active' ? (
                      <button
                        onClick={() => onAcknowledge && onAcknowledge(alert.id)}
                        className='bg-primary text-on-primary px-sm py-xs rounded text-[10px] font-bold hover:opacity-90 transition-all active:scale-95'
                      >
                        Acknowledge
                      </button>
                    ) : (
                      <button
                        className='bg-outline-variant text-on-surface-variant px-sm py-xs rounded text-[10px] font-bold cursor-not-allowed'
                        disabled
                      >
                        Acknowledged
                      </button>
                    )}
                    <button
                      onClick={() => onViewProtocol && onViewProtocol(alert)}
                      className='border border-outline px-sm py-xs rounded text-[10px] font-bold hover:bg-surface-container transition-all active:scale-95 text-on-surface'
                    >
                      View Protocol
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='6' className='px-md py-lg text-center text-on-surface-variant italic'>
                  No active alerts detected.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className='p-sm bg-surface-container-low/50 text-center'>
        <span className='text-[10px] font-label-mono text-on-surface-variant uppercase tracking-widest'>
          Showing {alerts.length} of {alerts.length} logged incidents
        </span>
      </div>
    </section>
  );
}
