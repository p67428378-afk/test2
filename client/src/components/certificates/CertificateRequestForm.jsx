import React, { useState } from 'react';
import { FileCheck, AlertCircle } from 'lucide-react';

const CertificateRequestForm = ({ onSubmit, initialValues = {}, isSubmitting = false, error = null }) => {
  const [accountNumber, setAccountNumber] = useState(initialValues.accountNumber || '');
  const [purpose, setPurpose] = useState(initialValues.purpose || 'visa');
  const [otp, setOtp] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!accountNumber.trim()) {
      setFormError('Account number is required.');
      return;
    }
    if (!otp.trim()) {
      setFormError('OTP is required for identity verification.');
      return;
    }

    onSubmit({ accountNumber, purpose, otp });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-surface-container-lowest border border-outline-variant rounded-xl p-8 shadow-sm max-w-xl mx-auto">
      <div className="border-b border-outline-variant pb-4">
        <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
          <FileCheck className="text-primary-container" /> Request Balance Certificate
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
          Please provide your account details and verify your identity with an OTP.
        </p>
      </div>

      {(error || formError) && (
        <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-error flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="font-body-sm text-body-sm">
            {formError || error}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Account Number */}
        <div>
          <label htmlFor="accountNumber" className="block font-label-md text-label-md text-on-surface mb-1.5">
            Account Number
          </label>
          <input
            type="text"
            id="accountNumber"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="e.g. 1002948571"
            disabled={isSubmitting}
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface font-body-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all outline-none disabled:opacity-50"
          />
        </div>

        {/* Purpose */}
        <div>
          <label htmlFor="purpose" className="block font-label-md text-label-md text-on-surface mb-1.5">
            Purpose of Certificate
          </label>
          <select
            id="purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            disabled={isSubmitting}
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface font-body-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all outline-none disabled:opacity-50"
          >
            <option value="visa">Visa Application</option>
            <option value="loan">Loan Application</option>
            <option value="audit">Audit Purpose</option>
            <option value="other">Other Personal Use</option>
          </select>
        </div>

        {/* OTP */}
        <div>
          <label htmlFor="otp" className="block font-label-md text-label-md text-on-surface mb-1.5">
            One-Time Password (OTP)
          </label>
          <input
            type="password"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            disabled={isSubmitting}
            className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface font-body-sm focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all outline-none disabled:opacity-50"
          />
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-1.5">
            For testing, you can use any 6-digit OTP (e.g., 123456).
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary-container text-on-primary font-label-md text-label-md py-3 rounded-lg hover:bg-primary-container/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
      >
        {isSubmitting ? 'Generating Certificate...' : 'Generate Certificate'}
      </button>
    </form>
  );
};

export default CertificateRequestForm;
