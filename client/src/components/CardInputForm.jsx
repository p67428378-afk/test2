import React, { useState } from 'react';

const CardInputForm = ({ onSubmit, isSubmitting, error }) => {
  const [threshold, setThreshold] = useState('');
  const [channel, setChannel] = useState('SMS');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      card_number: '************1234', // This is a mock value as per the UI
      daily_spend_threshold: parseFloat(threshold),
      alert_delivery_channel: channel,
    });
  };

  return (
    <div id="setup-view">
      <h1 className="text-headline-md font-headline-md text-on-surface mb-xl">Set Up Debit Card Spend Alert</h1>
      <form className="space-y-xl" onSubmit={handleSubmit}>
        <div className="space-y-xs">
          <label className="text-label-md font-label-md text-on-surface">Debit Card Number</label>
          <div className="relative">
            <input 
              className="w-full h-[48px] px-md pr-xl border border-outline-variant rounded-lg bg-surface-container-low text-on-surface-variant font-body-md cursor-not-allowed"
              readOnly 
              type="text" 
              value="************1234" 
            />
            <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant">lock</span>
          </div>
        </div>

        <div className="space-y-xs">
          <label className="text-label-md font-label-md text-on-surface" htmlFor="threshold">Daily Spend Threshold</label>
          <div className="relative">
            <span className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant font-body-md">$</span>
            <input 
              className="w-full h-[48px] pl-xl pr-md border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-0 transition-all"
              id="threshold" 
              placeholder="e.g., 100.00" 
              required 
              step="0.01" 
              type="number" 
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-md">
          <span className="text-label-md font-label-md text-on-surface block">Alert Delivery Channel</span>
          <div className="flex gap-xl">
            <label className="flex items-center gap-base cursor-pointer group">
              <div className="relative w-5 h-5">
                <input 
                  className="peer sr-only" 
                  name="channel" 
                  type="radio" 
                  value="SMS" 
                  checked={channel === 'SMS'}
                  onChange={(e) => setChannel(e.target.value)}
                />
                <div className="w-5 h-5 border-2 border-outline rounded-full peer-checked:border-primary peer-checked:border-[6px] transition-all"></div>
              </div>
              <span className="text-body-md font-body-md text-on-surface-variant group-hover:text-on-surface">SMS</span>
            </label>
            <label className="flex items-center gap-base cursor-pointer group">
              <div className="relative w-5 h-5">
                <input 
                  className="peer sr-only" 
                  name="channel" 
                  type="radio" 
                  value="Email" 
                  checked={channel === 'Email'}
                  onChange={(e) => setChannel(e.target.value)}
                />
                <div className="w-5 h-5 border-2 border-outline rounded-full peer-checked:border-primary peer-checked:border-[6px] transition-all"></div>
              </div>
              <span className="text-body-md font-body-md text-on-surface-variant group-hover:text-on-surface">Email</span>
            </label>
          </div>
        </div>
        
        {error && <p className="text-error text-sm">{error}</p>}

        <button 
          className="w-full h-[48px] bg-primary-container text-on-primary font-body-md font-semibold rounded-lg hover:opacity-90 active:scale-[0.98] transition-all mt-xl shadow-sm disabled:opacity-50"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Proceed to OTP Verification'}
        </button>
      </form>
    </div>
  );
};

export default CardInputForm;
