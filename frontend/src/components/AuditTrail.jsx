import React from 'react';

const AuditTrail = () => {
  return (
    <section className='bg-surface-container-low rounded-full p-8'>
      <div className='flex items-center justify-between mb-8 px-2'>
        <div className='flex items-center gap-4'>
          <span className='material-symbols-outlined text-primary'>history</span>
          <h3 className='text-xl font-headline font-bold text-blue-900'>Verification Audit Trail</h3>
        </div>
        <button className='text-xs font-bold text-primary hover:underline tracking-widest uppercase'>Export Logs</button>
      </div>
      <div className='overflow-x-auto'>
        <table className='w-full border-separate border-spacing-y-3'>
          <thead>
            <tr className='text-left'>
              <th className='px-6 py-2 text-[10px] font-bold text-outline uppercase tracking-widest'>Process Milestone</th>
              <th className='px-6 py-2 text-[10px] font-bold text-outline uppercase tracking-widest'>Method</th>
              <th className='px-6 py-2 text-[10px] font-bold text-outline uppercase tracking-widest'>Status</th>
              <th className='px-6 py-2 text-[10px] font-bold text-outline uppercase tracking-widest'>Timestamp</th>
              <th className='px-6 py-2 text-[10px] font-bold text-outline uppercase tracking-widest'>Reference</th>
            </tr>
          </thead>
          <tbody>
            <tr className='bg-surface-container-lowest shadow-sm rounded-xl transition-all hover:translate-x-1'>
              <td className='px-6 py-4 rounded-l-xl'>
                <p className='text-sm font-bold text-on-surface'>Aadhaar e-KYC</p>
                <p className='text-[10px] text-on-surface-variant'>Biometric match successful</p>
              </td>
              <td className='px-6 py-4'>
                <span className='px-3 py-1 bg-surface-container text-[10px] font-bold uppercase rounded-md'>OTP-AUTH</span>
              </td>
              <td className='px-6 py-4'>
                <span className='flex items-center gap-2 text-tertiary font-bold text-xs'>
                  <span className='w-2 h-2 rounded-full bg-tertiary'></span> Success
                </span>
              </td>
              <td className='px-6 py-4 text-xs font-mono text-on-surface-variant'>12 OCT 2023, 14:12:01</td>
              <td className='px-6 py-4 rounded-r-xl text-xs font-mono text-outline'>UIDAI-7781-B</td>
            </tr>
            <tr className='bg-surface-container-lowest shadow-sm rounded-xl transition-all hover:translate-x-1'>
              <td className='px-6 py-4 rounded-l-xl'>
                <p className='text-sm font-bold text-on-surface'>PAN Validation</p>
                <p className='text-[10px] text-on-surface-variant'>NSDL database cross-referenced</p>
              </td>
              <td className='px-6 py-4'>
                <span className='px-3 py-1 bg-surface-container text-[10px] font-bold uppercase rounded-md'>API-LOOKUP</span>
              </td>
              <td className='px-6 py-4'>
                <span className='flex items-center gap-2 text-tertiary font-bold text-xs'>
                  <span className='w-2 h-2 rounded-full bg-tertiary'></span> Success
                </span>
              </td>
              <td className='px-6 py-4 text-xs font-mono text-on-surface-variant'>12 OCT 2023, 14:15:33</td>
              <td className='px-6 py-4 rounded-r-xl text-xs font-mono text-outline'>ITD-PAN-X992</td>
            </tr>
            <tr className='bg-surface-container-lowest shadow-sm rounded-xl transition-all hover:translate-x-1'>
              <td className='px-6 py-4 rounded-l-xl'>
                <p className='text-sm font-bold text-on-surface'>Liveness Detection</p>
                <p className='text-[10px] text-on-surface-variant'>3D Face mapping complete</p>
              </td>
              <td className='px-6 py-4'>
                <span className='px-3 py-1 bg-surface-container text-[10px] font-bold uppercase rounded-md'>AI-BIO</span>
              </td>
              <td className='px-6 py-4'>
                <span className='flex items-center gap-2 text-tertiary font-bold text-xs'>
                  <span className='w-2 h-2 rounded-full bg-tertiary'></span> Success
                </span>
              </td>
              <td className='px-6 py-4 text-xs font-mono text-on-surface-variant'>12 OCT 2023, 14:21:55</td>
              <td className='px-6 py-4 rounded-r-xl text-xs font-mono text-outline'>LIV-FACE-A01</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default AuditTrail;
