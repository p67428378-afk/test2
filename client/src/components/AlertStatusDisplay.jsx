import React from 'react';

const AlertStatusDisplay = ({ successMessage, threshold, channel }) => {
  if (!successMessage) return null;

  return (
    <div
      id='successMessage'
      className='mb-stack-lg p-stack-md rounded-lg bg-green-500 text-white flex items-center gap-stack-md animate-in fade-in slide-in-from-top-4 duration-500'
    >
      <span className='material-symbols-outlined' style={{ fontVariationSettings: "'FILL' 1" }}>
        check_circle
      </span>
      <div>
        <p className='font-bold font-body-md'>{successMessage}</p>
        <p className='text-sm opacity-90'>
          Confirmed Threshold: {threshold} | Delivery Channel: {channel}
        </p>
      </div>
    </div>
  );
};

export default AlertStatusDisplay;
