import React, { useState } from 'react';
import InputField from '../common/InputField';
import ComplianceNotice from '../common/ComplianceNotice';
import Button from '../common/Button';

export default function RequestInitiationForm({ onSubmit, isLoading, error }) {
  const [accountNumber, setAccountNumber] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const validate = () => {
    const errors = {};
    if (!/^\d{12}$/.test(accountNumber)) {
      errors.accountNumber = 'Account number must be exactly 12 digits.';
    }
    if (!/^\d{10}$/.test(mobileNumber)) {
      errors.mobileNumber = 'Mobile number must be exactly 10 digits.';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(accountNumber, mobileNumber);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-lg'>
      {error && (
        <div className='p-md bg-error-container text-on-error-container rounded-DEFAULT border border-error/30 text-body-md' role='alert'>
          {error}
        </div>
      )}

      <InputField
        label='Account Number'
        id='account-number'
        name='account-number'
        placeholder='Enter 12-digit account number'
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
        required
        maxLength={12}
        error={validationErrors.accountNumber}
        helpText='Your active savings or current account number'
        disabled={isLoading}
      />

      <InputField
        label='New Mobile Number'
        id='mobile-number'
        name='mobile-number'
        placeholder='Enter 10-digit mobile number'
        value={mobileNumber}
        onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
        required
        maxLength={10}
        prefix='+91'
        error={validationErrors.mobileNumber}
        helpText='A verification OTP will be sent to this number'
        disabled={isLoading}
      />

      <ComplianceNotice />

      <div className='flex flex-col-reverse sm:flex-row justify-end gap-md pt-lg border-t border-outline-variant/30 mt-xl'>
        <Button variant='secondary' disabled={isLoading}>
          Cancel
        </Button>
        <Button type='submit' variant='primary' isLoading={isLoading} icon='lock' disabled={isLoading}>
          {isLoading ? 'Sending OTP...' : 'Send Verification OTP'}
        </Button>
      </div>
    </form>
  );
}
