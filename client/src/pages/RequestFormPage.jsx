import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { requestCertificate } from '../services/api';
import CertificateRequestForm from '../components/certificates/CertificateRequestForm';

const RequestFormPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Pre-populate form if navigated from a retry action
  const initialValues = location.state || {};

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await requestCertificate(
        formData.accountNumber,
        formData.otp,
        formData.purpose
      );
      // Navigate to success page with the generated certificate details
      navigate('/success', { state: { certificate: result } });
    } catch (err) {
      console.error('Failed to request certificate:', err);
      const errMsg = err.response?.data?.detail || 'An unexpected error occurred. Please try again.';
      setError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
      {/* TopNavBar */}
      <header className="bg-surface dark:bg-on-background text-primary dark:text-primary-fixed border-b border-outline-variant flex items-center h-16 px-container-padding-desktop shrink-0 z-10 sticky top-0">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors font-label-md text-label-md"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Dashboard
        </button>
      </header>

      {/* Scrollable Canvas */}
      <main className="flex-1 overflow-y-auto p-container-padding-desktop flex items-center justify-center">
        <div className="w-full max-w-xl">
          <CertificateRequestForm
            onSubmit={handleSubmit}
            initialValues={initialValues}
            isSubmitting={isSubmitting}
            error={error}
          />
        </div>
      </main>
    </div>
  );
};

export default RequestFormPage;
