import React, { useState } from 'react';
import DualOTPVerificationForm from '../components/mobile-update/DualOTPVerificationForm';
import ProgressStepper from '../components/mobile-update/ProgressStepper';
import { verifyOldOTP, verifyNewOTP } from '../services/api';

export default function DualOTPVerificationPage({ requestId, status, onNext, onBack }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = async (otp) => {
    setIsLoading(true);
    setError('');
    try {
      if (status === 'PENDING_OLD_OTP') {
        const data = await verifyOldOTP(requestId, otp);
        onNext(data.status);
      } else if (status === 'PENDING_NEW_OTP') {
        const data = await verifyNewOTP(requestId, otp);
        onNext(data.status);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid or expired OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='bg-surface-container-lowest rounded-lg shadow-soft-deep w-full max-w-[550px] p-lg md:p-xl border border-outline-variant/30'>
      <div className='mb-lg'>
        <h1 className='font-headline-md text-headline-md text-[#0F172A] mb-unit'>Update Registered Mobile Number</h1>
        <p className='font-body-md text-body-md text-on-surface-variant'>Step 2 of 3: OTP Verification</p>
      </div>

      <ProgressStepper currentStep={2} />

      <DualOTPVerificationForm
        status={status}
        onSubmit={handleVerify}
        onBack={onBack}
        isLoading={isLoading}
        error={error}
      />
    </div>
  );
}
