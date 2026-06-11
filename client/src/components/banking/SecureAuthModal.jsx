import React, { useState } from 'react';

export default function SecureAuthModal({ isOpen, onClose, onConfirm }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError('Please enter your password to authorize this transfer.');
      return;
    }

    onConfirm(password);
    setPassword('');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-md">
      <div className="glass-card w-full max-w-md rounded-2xl p-lg flex flex-col gap-md relative">
        <button
          onClick={onClose}
          className="absolute top-md right-md text-on-surface-variant hover:bg-surface-container-high p-1 rounded-full"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="flex items-center gap-md text-primary">
          <span className="material-symbols-outlined text-3xl">security</span>
          <h3 className="font-title-lg text-title-lg font-bold">Secure Authorization</h3>
        </div>

        <p className="font-body-md text-body-md text-on-surface-variant">
          For your security, please re-enter your password to authorize this P2P transfer.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-md">
          {error && (
            <div className="p-md rounded-lg bg-error-container text-on-error-container text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="font-label-sm text-on-surface-variant mb-2 block">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-md text-on-surface focus:border-primary focus:ring-0 focus:outline-none"
              type="password"
              placeholder="Enter your password"
              required
              autoFocus
            />
          </div>

          <div className="flex gap-md mt-md">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-surface-container-high text-on-surface font-label-lg py-md rounded-xl hover:brightness-110 active:scale-[0.98] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary text-on-primary font-label-lg py-md rounded-xl hover:brightness-110 active:scale-[0.98] transition-all"
            >
              Authorize
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
