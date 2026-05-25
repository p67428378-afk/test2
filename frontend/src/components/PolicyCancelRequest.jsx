import React, { useState } from 'react';
import { createPolicyCancelRequest } from '../services/api';

const PolicyCancelRequest = () => {
  const [message, setMessage] = useState(null);

  const handleCancel = () => {
    const requestData = {
      policy_id: 'policy-123',
      request_type: 'CANCEL',
      submitted_by: 'user-abc'
    };

    createPolicyCancelRequest(requestData)
      .then(response => {
        setMessage('Cancellation request submitted successfully!');
      })
      .catch(error => {
        setMessage('Error submitting cancellation request.');
        console.error('Error submitting cancellation request:', error);
      });
  };

  return (
    <div className='bg-error-container/20 p-6 rounded-xl border-2 border-error/5 group'>
      <h4 className='font-bold text-error mb-2 flex items-center gap-2'>
        <span className='material-symbols-outlined text-lg' data-icon='cancel'>cancel</span>
        Policy Termination
      </h4>
      <p className='text-sm text-on-surface-variant mb-6 leading-relaxed'>
        Requesting a cancellation will initiate a 30-day cooling-off period. Your coverage will remain active until the end of the current billing cycle.
      </p>
      <button onClick={handleCancel} className='w-full py-3 px-4 rounded-xl border-2 border-error text-error font-bold text-sm hover:bg-error hover:text-white transition-all duration-200'>
        Request Cancellation
      </button>
      <p className='text-[10px] text-outline text-center mt-4'>
        By proceeding, you agree to the <a className='underline' href='#'>terms of disenrollment</a>.
      </p>
      {message && <div className='mt-4 text-center text-sm font-medium'>{message}</div>}
    </div>
  );
};

export default PolicyCancelRequest;
