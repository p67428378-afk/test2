import React, { useState } from 'react';
import OTPInputGroup from '../common/OTPInputGroup';
import Button from '../common/Button';

export default function DualOTPVerificationForm({
  status,
  onSubmit,
  onBack,
  isLoading,
  error
}) {
  const [otp, setOtp] = useState('');
  const [validationError, setValidationError] = useState('');

  const isOldOtp = status === 'PENDING_OLD_OTP';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setValidationError('Please enter a 6-digit OTP.');
      return;
    }
    setValidationError('');
    onSubmit(otp);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-lg'>
      <div className='text-center mb-md'>
        <h2 className='font-headline-md text-headline-md text-[#0F172A] mb-unit'>
          {isOldOtp ? 'Verify Old Mobile Number' : 'Verify New Mobile Number'}
        </h2>
        <p className='font-body-md text-body-md text-on-surface-variant'>
          {isOldOtp
            ? 'We have sent a 6-digit OTP to your registered old mobile number via SMS.'
            : 'We have sent a 6-digit OTP to your new mobile number via SMS.'}
        </p>
        <p className='font-label-sm text-label-sm text-on-surface-variant mt-sm italic'>
          SMS is the primary method. If you do not receive it, a voice call backup will be initiated.
        </p>
      </div>

      {error && (
        <div className='p-md bg-error-container text-on-error-container rounded-DEFAULT border border-error/30 text-body-md text-center' role='alert'>
          {error}
        </div>
      )}

      <div className='flex justify-center py-md'>
        <OTPInputGroup
          value={otp}
          onChange={(val) => {
            setOtp(val);
            if (val.length === 6) setValidationError('');
          }}
          error={validationError}
        />
      </div>

      <div className='flex flex-col-reverse sm:flex-row justify-between gap-md pt-lg border-t border-outline-variant/30 mt-xl'>
        <Button variant='secondary' onClick={onBack} disabled={isLoading}>
          Back
        </Button>
        <Button type='submit' variant='primary' disabled={isLoading || otp.length !== 6}>
          {isLoading ? 'Verifying...' : 'Verify & Proceed'}
        </Button>
      </div>
    </form>
  );
}
