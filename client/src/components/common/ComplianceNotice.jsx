import React from 'react';

export default function ComplianceNotice() {
  return (
    <div className='bg-surface-container-low p-md rounded-DEFAULT border border-outline-variant/50 flex gap-sm items-start mt-lg'>
      <span className='material-symbols-outlined text-on-surface-variant mt-1' style={{ fontVariationSettings: "'FILL' 1" }}>
        info
      </span>
      <p className='font-label-sm text-label-sm text-on-surface-variant leading-relaxed'>
        <strong className='text-[#0F172A] font-semibold'>Regulatory Compliance:</strong> By proceeding, you consent to OTP verification on both your old and new mobile numbers in compliance with RBI KYC Master Directions 2016, TRAI Guidelines, and the IT Act 2000.
      </p>
    </div>
  );
}
