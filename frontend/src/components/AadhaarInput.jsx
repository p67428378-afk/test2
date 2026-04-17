
import React, { useState } from 'react';

const AadhaarInput = () => {
  const [aadhaarNumber, setAadhaarNumber] = useState('5421 8890 2231');
  const [fileName, setFileName] = useState('aadhaar_front_final.pdf');
  const [fileSize, setFileSize] = useState('4.2 MB');

  return (
    <section className='col-span-1 bg-surface-container-lowest p-8 rounded-xl shadow-sm space-y-6'>
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='bg-primary-fixed p-2 rounded-lg'>
            <span className='material-symbols-outlined text-primary' data-icon='badge'>badge</span>
          </div>
          <h2 className='font-headline font-bold text-lg'>Aadhaar Input</h2>
        </div>
        <span className='text-[10px] font-bold uppercase tracking-widest text-on-tertiary-container bg-tertiary px-2 py-1 rounded'>Secure Port</span>
      </div>
      <div className='space-y-4'>
        <div className='group'>
          <label className='text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 block'>UIDAI Number</label>
          <input 
            className='w-full bg-surface-container-low border-none rounded-xl p-4 font-mono tracking-widest text-lg focus:ring-2 focus:ring-primary-fixed transition-all outline-none' 
            placeholder='XXXX XXXX XXXX' 
            type='text' 
            value={aadhaarNumber}
            onChange={(e) => setAadhaarNumber(e.target.value)}
          />
        </div>
        <div className='relative group'>
          <label className='text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 block'>Identity Document</label>
          <div className='border-2 border-dashed border-outline-variant bg-surface-container-low rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-surface-container-high transition-colors'>
            <span className='material-symbols-outlined text-4xl text-outline mb-4' data-icon='cloud_upload'>cloud_upload</span>
            <p className='text-sm font-medium text-on-surface'>{fileName}</p>
            <p className='text-xs text-on-surface-variant mt-1'>{fileSize} • Upload Complete</p>
          </div>
        </div>
        <div className='flex items-center gap-3 bg-tertiary/10 p-3 rounded-lg'>
          <span className='material-symbols-outlined text-on-tertiary-container' data-icon='check_circle'>check_circle</span>
          <span className='text-sm font-semibold text-on-tertiary-container'>Real-time validation successful</span>
        </div>
      </div>
    </section>
  );
};

export default AadhaarInput;
