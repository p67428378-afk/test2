import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuditTrailSummary from '../components/assortment/AuditTrailSummary';
import Button from '../components/common/Button';

const ConfirmationPage = ({ auditData }) => {
  const navigate = useNavigate();

  return (
    <div className='space-y-6 max-w-3xl mx-auto'>
      <div className='bg-surface-container rounded-lg p-8 text-center border border-outline-variant/30 space-y-4'>
        <div className='w-16 h-16 bg-green-status/10 rounded-full flex items-center justify-center mx-auto border border-green-status/30'>
          <span className='material-symbols-outlined text-green-status text-3xl'>check_circle</span>
        </div>
        <h2 className='text-2xl font-bold text-on-surface'>Assortment Plan Approved!</h2>
        <p className='text-sm text-on-surface-variant max-w-md mx-auto'>
          The Snacks category assortment plan for the Small Town Value Cluster has been successfully submitted and logged.
        </p>
        <div className='flex justify-center space-x-4 pt-2'>
          <Button onClick={() => navigate('/')} variant='secondary'>
            Go to Dashboard
          </Button>
          <Button onClick={() => navigate('/scenarios')}>
            Compare Scenarios
          </Button>
        </div>
      </div>

      {auditData ? (
        <AuditTrailSummary auditData={auditData} />
      ) : (
        <div className='bg-surface-container rounded-lg p-6 border border-outline-variant/30 text-center'>
          <p className='text-xs text-on-surface-variant'>No active submission found in this session.</p>
        </div>
      )}
    </div>
  );
};

export default ConfirmationPage;
