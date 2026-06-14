import React from 'react';

const AuditLogTable = ({ logs }) => {
  return (
    <div className='bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant flex flex-col overflow-hidden h-full'>
      <div className='p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low'>
        <h3 className='font-headline-sm text-headline-sm text-on-background'>Recent Security &amp; Audit Logs</h3>
        <span className='text-[10px] font-mono text-outline-variant border border-outline-variant px-2 rounded'>PMLA 2002</span>
      </div>
      <div className='overflow-x-auto flex-1'>
        <table className='w-full text-left border-collapse'>
          <thead>
            <tr className='bg-surface-bright border-b border-surface-variant font-label-md text-[11px] text-on-surface-variant uppercase'>
              <th className='p-3 font-semibold'>Event</th>
              <th className='p-3 font-semibold'>Details</th>
              <th className='p-3 font-semibold text-right'>Status</th>
            </tr>
          </thead>
          <tbody className='font-data-mono text-[12px] divide-y divide-surface-variant'>
            {logs && logs.length > 0 ? (
              logs.map((log) => (
                <tr key={log.id} className='hover:bg-surface-bright transition-colors'>
                  <td className='p-3 text-primary-container font-bold'>{log.eventType}</td>
                  <td className='p-3 text-outline max-w-[200px] truncate' title={log.details}>
                    {log.details || 'N/A'}
                  </td>
                  <td className='p-3 text-right'>
                    <span className='inline-flex items-center gap-1 text-[#166534] bg-[#dcfce7] px-2 py-0.5 rounded text-[10px] font-bold'>
                      SUCCESS
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='3' className='p-4 text-center text-outline'>
                  No recent audit logs found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className='p-3 border-t border-surface-variant text-center mt-auto'>
        <a className='font-label-md text-[12px] text-primary hover:underline' href='#'>View Full Audit Trail</a>
      </div>
    </div>
  );
};

export default AuditLogTable;
