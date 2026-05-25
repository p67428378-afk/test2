import React from 'react';

const ComplianceFooter = () => {
  return (
    <footer className='mb-24 space-y-6'>
      <div className='bg-surface-container-high/50 p-6 rounded-xl border border-white/50 backdrop-blur-sm'>
        <div className='flex items-start gap-4'>
          <div className='bg-primary/5 p-3 rounded-lg'>
            <span className='material-symbols-outlined text-primary text-2xl'>verified_user</span>
          </div>
          <div>
            <h4 className='font-headline font-bold text-primary text-sm mb-1'>Secure Statement Vault</h4>
            <p className='text-on-surface-variant text-xs leading-relaxed'>
              This statement is generated in compliance with RBI master directions on digital banking. Your data is protected using AES-256 end-to-end encryption.
            </p>
          </div>
        </div>
      </div>
      <div className='flex flex-col items-center gap-2 opacity-40 grayscale'>
        <div className='flex gap-4'>
          <span className='text-[10px] font-bold uppercase tracking-widest'>PCI DSS COMPLIANT</span>
          <span className='text-[10px] font-bold uppercase tracking-widest'>ISO 27001</span>
        </div>
      </div>
    </footer>
  );
};

export default ComplianceFooter;
