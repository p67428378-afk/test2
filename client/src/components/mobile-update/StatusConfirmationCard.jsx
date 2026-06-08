import React from 'react';
import Button from '../common/Button';

export default function StatusConfirmationCard({ status, onReset, error }) {
  const isSuccess = status === 'COMPLETED';

  return (
    <div className='text-center space-y-lg'>
      <div className='flex justify-center'>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
          isSuccess ? 'bg-secondary-container text-secondary' : 'bg-error-container text-error'
        }`}>
          <span className='material-symbols-outlined text-[40px]'>
            {isSuccess ? 'check_circle' : 'cancel'}
          </span>
        </div>
      </div>

      <div>
        <h2 className='font-headline-md text-headline-md text-[#0F172A] mb-unit'>
          {isSuccess ? 'Mobile Number Updated!' : 'Update Failed'}
        </h2>
        <p className='font-body-md text-body-md text-on-surface-variant'>
          {isSuccess
            ? 'Your mobile number has been successfully updated in the Core Banking System (CBS) and CKYC registry.'
            : error || 'An error occurred while updating your mobile number in our records. Please try again.'}
        </p>
        {isSuccess && (
          <p className='font-label-sm text-label-sm text-secondary font-semibold mt-sm'>
            A confirmation SMS has been sent to your new mobile number.
          </p>
        )}
      </div>

      <div className='pt-lg border-t border-outline-variant/30 mt-xl flex justify-center'>
        <Button variant='primary' onClick={onReset}>
          Done
        </Button>
      </div>
    </div>
  );
}
