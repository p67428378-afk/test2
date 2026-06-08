import React from 'react';
import StatusConfirmationCard from '../components/mobile-update/StatusConfirmationCard';
import ProgressStepper from '../components/mobile-update/ProgressStepper';

export default function StatusConfirmationPage({ status, onReset, error }) {
  return (
    <div className='bg-surface-container-lowest rounded-lg shadow-soft-deep w-full max-w-[550px] p-lg md:p-xl border border-outline-variant/30'>
      <div className='mb-lg'>
        <h1 className='font-headline-md text-headline-md text-[#0F172A] mb-unit'>Update Registered Mobile Number</h1>
        <p className='font-body-md text-body-md text-on-surface-variant'>Step 3 of 3: Confirmation</p>
      </div>

      <ProgressStepper currentStep={3} />

      <StatusConfirmationCard status={status} onReset={onReset} error={error} />
    </div>
  );
}
