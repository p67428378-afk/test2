
import React from 'react';

const AuditTrail = () => {
  return (
    <div className='col-span-12 bg-surface-container-low p-10 rounded-xl'>
      <div className='flex justify-between items-center mb-10'>
        <h3 className='text-2xl font-headline font-extrabold text-primary'>Immutable Audit Ledger</h3>
        <div className='flex gap-2'>
          <span className='px-4 py-2 bg-surface-container-lowest text-on-surface-variant text-xs font-bold rounded-md'>Filter: All Events</span>
          <button className='p-2 bg-surface-container-lowest text-primary rounded-md shadow-sm'>
            <span className='material-symbols-outlined'>download</span>
          </button>
        </div>
      </div>
      <div className='max-h-[500px] overflow-y-auto pr-4 space-y-4'>
        {/* Verification Stack Logic */}
        <div className='flex items-start gap-8'>
          <div className='flex flex-col items-center'>
            <div className='w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-lg'>
              <span className='material-symbols-outlined text-xl'>gavel</span>
            </div>
            <div className='w-0.5 h-16 border-l-2 border-dashed border-outline-variant my-2'></div>
          </div>
          <div className='flex-1 bg-surface-container-lowest p-6 rounded-lg flex justify-between items-center'>
            <div>
              <div className='flex items-center gap-3 mb-1'>
                <span className='font-headline font-bold text-primary'>Compliance Review Triggered</span>
                <span className='px-2 py-0.5 bg-error-container text-on-error-container text-[10px] font-bold rounded uppercase'>Action Required</span>
              </div>
              <p className='text-sm text-on-surface-variant'>Manual override requested due to high risk score on image authenticity check.</p>
            </div>
            <div className='text-right'>
              <p className='text-xs font-bold text-primary'>OCT 24, 2023</p>
              <p className='text-[10px] text-on-surface-variant uppercase tracking-widest'>14:22:10 UTC</p>
            </div>
          </div>
        </div>
        <div className='flex items-start gap-8'>
          <div className='flex flex-col items-center'>
            <div className='w-10 h-10 rounded-full bg-primary-fixed-dim text-primary flex items-center justify-center'>
              <span className='material-symbols-outlined text-xl'>database</span>
            </div>
            <div className='w-0.5 h-16 border-l-2 border-dashed border-outline-variant my-2'></div>
          </div>
          <div className='flex-1 bg-surface-container-lowest p-6 rounded-lg flex justify-between items-center opacity-80'>
            <div>
              <div className='flex items-center gap-3 mb-1'>
                <span className='font-headline font-bold text-primary'>Central Database Cross-Reference</span>
                <span className='px-2 py-0.5 bg-primary-fixed text-on-primary-fixed text-[10px] font-bold rounded uppercase'>Completed</span>
              </div>
              <p className='text-sm text-on-surface-variant'>Aadhaar details verified against UIDAI central repository. Identity confirmed.</p>
            </div>
            <div className='text-right'>
              <p className='text-xs font-bold text-primary'>OCT 24, 2023</p>
              <p className='text-[10px] text-on-surface-variant uppercase tracking-widest'>14:21:45 UTC</p>
            </div>
          </div>
        </div>
        <div className='flex items-start gap-8'>
          <div className='flex flex-col items-center'>
            <div className='w-10 h-10 rounded-full bg-primary-fixed-dim text-primary flex items-center justify-center'>
              <span className='material-symbols-outlined text-xl'>scan</span>
            </div>
            <div className='w-0.5 h-16 border-l-2 border-dashed border-outline-variant my-2'></div>
          </div>
          <div className='flex-1 bg-surface-container-lowest p-6 rounded-lg flex justify-between items-center opacity-60'>
            <div>
              <div className='flex items-center gap-3 mb-1'>
                <span className='font-headline font-bold text-primary'>OCR Image Extraction</span>
                <span className='px-2 py-0.5 bg-primary-fixed text-on-primary-fixed text-[10px] font-bold rounded uppercase'>Completed</span>
              </div>
              <p className='text-sm text-on-surface-variant'>OCR Engine v4.2 extracted data fields from Aadhaar and PAN documents.</p>
            </div>
            <div className='text-right'>
              <p className='text-xs font-bold text-primary'>OCT 24, 2023</p>
              <p className='text-[10px] text-on-surface-variant uppercase tracking-widest'>14:21:30 UTC</p>
            </div>
          </div>
        </div>
        <div className='flex items-start gap-8'>
          <div className='flex flex-col items-center'>
            <div className='w-10 h-10 rounded-full bg-primary-fixed-dim text-primary flex items-center justify-center'>
              <span className='material-symbols-outlined text-xl'>upload_file</span>
            </div>
          </div>
          <div className='flex-1 bg-surface p-6 rounded-lg flex justify-between items-center opacity-40'>
            <div>
              <div className='flex items-center gap-3 mb-1'>
                <span className='font-headline font-bold text-primary'>Document Intake Initialization</span>
                <span className='px-2 py-0.5 bg-primary-fixed text-on-primary-fixed text-[10px] font-bold rounded uppercase'>Success</span>
              </div>
              <p className='text-sm text-on-surface-variant'>Application received from client portal. Initializing verification workflow.</p>
            </div>
            <div className='text-right'>
              <p className='text-xs font-bold text-primary'>OCT 24, 2023</p>
              <p className='text-[10px] text-on-surface-variant uppercase tracking-widest'>14:20:00 UTC</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditTrail;
