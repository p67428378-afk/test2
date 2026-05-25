
import React from 'react';
import StatusPanel from './StatusPanel';
import DocumentInput from './DocumentInput';
import AuditTrail from './AuditTrail';
import FloatingActionPanel from './FloatingActionPanel';

const MainContent = () => {
  return (
    <main className='flex-1 ml-64 p-10 space-y-10'>
      <div className='flex justify-between items-end'>
        <div className='mr-6'>
          <h1 className='text-4xl font-headline font-extrabold text-primary tracking-tight'>Onboarding Request #KYC-9902</h1>
          <p className='text-on-surface-variant font-body mt-2'>Individual Verification Queue • Assigned to Chief Compliance Officer</p>
        </div>
        <div className='flex gap-4'>
          <button className='px-6 py-3 border border-outline-variant font-semibold text-primary rounded-md hover:bg-surface-container-low transition-colors'>Review Details</button>
          <button className='px-8 py-3 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold rounded-md shadow-lg shadow-primary/20 hover:scale-[0.98] transition-transform'>Submit for Verification</button>
        </div>
      </div>
      <div className='grid grid-cols-12 gap-6'>
        <StatusPanel />
        <DocumentInput />
        <AuditTrail />
      </div>
      <FloatingActionPanel />
    </main>
  );
};

export default MainContent;
