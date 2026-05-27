import React, { useState } from 'react';
import CardInputForm from '../components/CardInputForm';
import OTPVerificationModal from '../components/OTPVerificationModal';
import AlertStatusDisplay from '../components/AlertStatusDisplay';
import useAlertSetup from '../hooks/useAlertSetup';

const DebitCardSpendAlertSetupPage = () => {
  const {
    isSubmitting,
    error,
    data,
    setup, // Changed from setupAlert to setup
    verify,
  } = useAlertSetup();

  const [view, setView] = useState('form'); // 'form', 'otp', 'success'
  const [transactionId, setTransactionId] = useState(null);
  const [formData, setFormData] = useState(null);

  const handleFormSubmit = async (formData) => {
    setFormData(formData);
    const result = await setup(formData);
    if (result && result.transaction_id) {
      setTransactionId(result.transaction_id);
      setView('otp');
    }
  };

  const handleOtpSubmit = async (otp) => {
    const result = await verify({ transaction_id: transactionId, otp_code: otp });
    if (result) {
      setView('success');
    }
  };

  const handleBackToDashboard = () => {
    setView('form');
    setTransactionId(null);
    setFormData(null);
  };

  return (
    <div className="bg-surface-container-lowest w-full max-w-[560px] rounded-lg tonal-elevation-1 p-lg">
      {view === 'form' && (
        <CardInputForm onSubmit={handleFormSubmit} isSubmitting={isSubmitting} error={error} />
      )}
      {view === 'otp' && (
        <OTPVerificationModal
          onSubmit={handleOtpSubmit}
          isSubmitting={isSubmitting}
          error={error}
          onResend={() => handleFormSubmit(formData)} // Resend OTP logic
        />
      )}
      {view === 'success' && (
        <AlertStatusDisplay 
          data={data} 
          onBackToDashboard={handleBackToDashboard} 
        />
      )}
    </div>
  );
};

export default DebitCardSpendAlertSetupPage;
