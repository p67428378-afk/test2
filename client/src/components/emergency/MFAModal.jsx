import React, { useState } from 'react';

export default function MFAModal({ isOpen, onClose, onConfirm, loading }) {
  const [mfaCode, setMfaCode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!mfaCode.trim()) {
      setError('MFA code is required');
      return;
    }

    onConfirm(mfaCode);
  };

  return (
    <div className='fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-md'>
      <div className='bg-surface-container border border-outline-variant rounded-lg p-lg max-w-md w-full shadow-xl relative'>
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-on-surface-variant hover:text-on-surface transition-colors'
        >
          <span className='material-symbols-outlined'>close</span>
        </button>

        <div className='flex flex-col items-center text-center mb-lg'>
          <div className='w-12 h-12 rounded-full bg-error-container/20 flex items-center justify-center mb-md border border-error/20'>
            <span className='material-symbols-outlined text-error text-[28px]'>security</span>
          </div>
          <h3 className='text-headline-md font-headline-md text-on-surface'>Two-Factor Authentication</h3>
          <p className='text-body-md text-on-surface-variant mt-1'>
            Please enter the 6-digit MFA code sent to your registered device to authorize this emergency fund allocation.
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-md'>
          {error && (
            <div className='bg-error-container/20 border border-error/30 text-error p-sm rounded text-body-md text-center'>
              {error}
            </div>
          )}

          <div>
            <input
              type="text"
              value={mfaCode}
              onChange={(e) => setMfaCode(e.target.value)}
              className='w-full bg-surface-variant border border-outline-variant rounded py-3 px-4 text-headline-md text-center tracking-widest text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-mono'
              placeholder="000000"
              maxLength={6}
              autoFocus
            />
          </div>

          <div className='flex gap-md pt-sm'>
            <button
              type="button"
              onClick={onClose}
              className='flex-1 bg-surface-variant text-on-surface py-2 rounded hover:bg-surface-bright transition-colors text-label-md font-label-md uppercase'
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className='flex-1 bg-error text-on-error py-2 rounded hover:bg-opacity-90 transition-opacity text-label-md font-label-md uppercase font-bold disabled:opacity-50'
            >
              {loading ? 'Verifying...' : 'Confirm & Authorize'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
