import React from 'react';

const AlertStatusDisplay = ({ data, onBackToDashboard }) => {
  if (!data) {
    return null; // Or a loading/error state
  }

  return (
    <div className="text-center space-y-lg py-xl">
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-secondary-container rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-on-secondary-container text-[40px]">check_circle</span>
        </div>
      </div>
      <div className="space-y-base">
        <h2 className="text-headline-md font-headline-md text-on-surface">Alert Setup Successful!</h2>
        <p className="text-body-md font-body-md text-on-surface-variant px-md">
          Your daily spend alert is now <span className="text-secondary font-bold">{data.status}</span> 
          with a threshold of <span className="font-bold">${data.threshold_amount?.toFixed(2)}</span>, 
          delivered via <span className="font-bold">{data.alert_delivery_channel}</span>.
        </p>
      </div>
      <button 
        className="h-[48px] px-xl border border-primary text-primary font-semibold rounded-lg hover:bg-surface-container-low transition-colors"
        onClick={onBackToDashboard}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default AlertStatusDisplay;
