import React from 'react';
import { useLocation } from 'react-router-dom';

const ApplicationStatusPage = () => {
  const location = useLocation();
  const { applicationResult } = location.state || {};

  if (!applicationResult) {
    return (
      <div className='w-full max-w-3xl bg-surface-container-lowest rounded-xl p-8 md:p-12 card-ambient relative overflow-hidden'>
        <h2 className='text-2xl font-bold mb-4'>No Application Data</h2>
        <p>Please submit an application to see the status.</p>
      </div>
    );
  }

  return (
    <div className='w-full max-w-3xl bg-surface-container-lowest rounded-xl p-8 md:p-12 card-ambient relative overflow-hidden'>
      <h2 className='text-2xl font-bold mb-4'>Application Status: {applicationResult.status}</h2>
      <p className='mb-4'>{applicationResult.decision_message}</p>
      {applicationResult.credit_limit && (
        <p className='font-bold'>Credit Limit: ${applicationResult.credit_limit}</p>
      )}
    </div>
  );
};

export default ApplicationStatusPage;
