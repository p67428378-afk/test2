import React, { useState } from 'react';
import RequestInitiationForm from '../components/mobile-update/RequestInitiationForm';
import ProgressStepper from '../components/mobile-update/ProgressStepper';
import { initiateMobileUpdate } from '../services/api';

export default function RequestInitiationPage({ onNext }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInitiate = async (accountNumber, newMobileNumber) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await initiateMobileUpdate(accountNumber, newMobileNumber);
      onNext(data.request_id, data.status);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to initiate mobile number update. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='bg-surface-container-lowest rounded-lg shadow-soft-deep w-full max-w-[550px] p-lg md:p-xl border border-outline-variant/30'>
      <div className='mb-lg'>
        <h1 className='font-headline-md text-headline-md text-[#0F172A] mb-unit'>Update Registered Mobile Number</h1>
        <p className='font-body-md text-body-md text-on-surface-variant'>Step 1 of 3: Enter your account details</p>
      </div>

      <ProgressStepper currentStep={1} />

      <RequestInitiationForm onSubmit={handleInitiate} isLoading={isLoading} error={error} />
    </div>
  );
}
