
import React, { useState } from 'react';
import { configureAlerts } from '../services/api';

const AlertThresholdForm = ({ userId }) => {
  const [thresholdPercentage, setThresholdPercentage] = useState('');
  const [leakDetectionPeriodHours, setLeakDetectionPeriodHours] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const configData = {
        user_id: userId,
        threshold_percentage: parseInt(thresholdPercentage, 10),
        leak_detection_period_hours: parseInt(leakDetectionPeriodHours, 10),
      };
      await configureAlerts(configData);
      setSuccess('Alert configuration saved successfully!');
    } catch (err) {
      setError('Failed to save alert configuration.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {error && <div className='text-red-500'>{error}</div>}
      {success && <div className='text-green-500'>{success}</div>}
      <div>
        <label htmlFor='thresholdPercentage' className='block text-sm font-medium text-gray-700'>
          Threshold Percentage (%)
        </label>
        <input
          type='number'
          id='thresholdPercentage'
          value={thresholdPercentage}
          onChange={(e) => setThresholdPercentage(e.target.value)}
          className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          required
        />
      </div>
      <div>
        <label htmlFor='leakDetectionPeriodHours' className='block text-sm font-medium text-gray-700'>
          Leak Detection Period (Hours)
        </label>
        <input
          type='number'
          id='leakDetectionPeriodHours'
          value={leakDetectionPeriodHours}
          onChange={(e) => setLeakDetectionPeriodHours(e.target.value)}
          className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          required
        />
      </div>
      <button
        type='submit'
        className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
      >
        Save Configuration
      </button>
    </form>
  );
};

export default AlertThresholdForm;
