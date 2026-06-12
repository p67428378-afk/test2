import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, ShieldCheck } from 'lucide-react';
import Button from '../common/Button';
import Badge from '../common/Badge';

export default function IdentityVerificationCard({
  verifications = [],
  onVerifyAadhaar,
  onVerifyPAN,
  isVerifyingAadhaar,
  isVerifyingPAN,
}) {
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);

  const aadhaarCheck = verifications.find((v) => v.checkType === 'AADHAAR_OTP');
  const panCheck = verifications.find((v) => v.checkType === 'PAN_VALIDATION');

  const handleAadhaarSubmit = (e) => {
    e.preventDefault();
    if (otp.length === 6) {
      onVerifyAadhaar(otp);
      setOtp('');
      setShowOtpInput(false);
    }
  };

  return (
    <div className="bg-surface-container rounded-lg border border-outline-variant p-6 space-y-6">
      <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
        <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">Identity Verification</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Aadhaar eKYC and PAN validation status</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Aadhaar eKYC */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface-container-low rounded-lg border border-outline-variant/30 gap-4">
          <div className="flex items-start gap-3">
            {aadhaarCheck?.status === 'PASSED' ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : aadhaarCheck?.status === 'FAILED' ? (
              <XCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            )}
            <div>
              <h3 className="font-body-lg text-body-lg font-semibold text-on-surface">Aadhaar eKYC (UIDAI API)</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                {aadhaarCheck?.details || 'OTP-based Aadhaar eKYC verification pending.'}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            {aadhaarCheck ? (
              <Badge status={aadhaarCheck.status} />
            ) : (
              <Badge status="PENDING" />
            )}
            {aadhaarCheck?.status !== 'PASSED' && !showOtpInput && (
              <Button
                variant="primary"
                onClick={() => setShowOtpInput(true)}
                disabled={isVerifyingAadhaar}
              >
                {isVerifyingAadhaar ? 'Verifying...' : 'Verify OTP'}
              </Button>
            )}
          </div>
        </div>

        {showOtpInput && (
          <form onSubmit={handleAadhaarSubmit} className="p-4 bg-surface-container-high rounded-lg border border-primary/30 flex items-center gap-3">
            <input
              type="text"
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter 6-digit OTP"
              className="bg-surface-container-lowest border border-outline-variant rounded px-3 py-1.5 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
            <Button type="submit" variant="success" disabled={otp.length !== 6 || isVerifyingAadhaar}>
              Submit
            </Button>
            <Button type="button" variant="secondary" onClick={() => setShowOtpInput(false)}>
              Cancel
            </Button>
          </form>
        )}

        {/* PAN Validation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface-container-low rounded-lg border border-outline-variant/30 gap-4">
          <div className="flex items-start gap-3">
            {panCheck?.status === 'PASSED' ? (
              <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : panCheck?.status === 'FAILED' ? (
              <XCircle className="w-5 h-5 text-error shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            )}
            <div>
              <h3 className="font-body-lg text-body-lg font-semibold text-on-surface">PAN Validation (Income Tax Dept)</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                {panCheck?.details || 'PAN card validation with Income Tax Department pending.'}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            {panCheck ? (
              <Badge status={panCheck.status} />
            ) : (
              <Badge status="PENDING" />
            )}
            {panCheck?.status !== 'PASSED' && (
              <Button
                variant="primary"
                onClick={onVerifyPAN}
                disabled={isVerifyingPAN}
              >
                {isVerifyingPAN ? 'Validating...' : 'Validate PAN'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}