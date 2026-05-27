import React, { useState } from 'react';
import AccountInput from './AccountInput';
import ThresholdInput from './ThresholdInput';
import DeliveryChannelSelect from './DeliveryChannelSelect';
import SubmitButton from './SubmitButton';
import AlertStatusDisplay from './AlertStatusDisplay';
import { setupLowBalanceAlert } from '../services/api';

const AlertSetupForm = () => {
  const [formData, setFormData] = useState({
    account_number: '1234567890',
    threshold_amount: '500.00',
    delivery_channel: 'SMS',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(null);

    if (formData.account_number.length < 10) {
      setError('Please enter a valid 10-digit account number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await setupLowBalanceAlert(formData);
      setSuccess({
        message: 'Alert successfully set!',
        threshold: response.data.confirmed_threshold,
        channel: response.data.delivery_channel,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const errorMessage = err.response?.data?.detail || 'An unexpected error occurred.';
      setError(errorMessage);
    }
    setIsSubmitting(false);
  };

  return (
    <section className='bg-surface-container-lowest rounded-lg shadow-md p-stack-lg border border-outline-variant'>
      {success && (
        <AlertStatusDisplay
          successMessage={success.message}
          threshold={success.threshold}
          channel={success.channel}
        />
      )}
      <form className='space-y-stack-lg' onSubmit={handleSubmit}>
        <AccountInput value={formData.account_number} onChange={handleChange} error={error.includes('account') ? error : ''} />
        <ThresholdInput value={formData.threshold_amount} onChange={handleChange} />
        <DeliveryChannelSelect value={formData.delivery_channel} onChange={handleChange} />
        {error && !error.includes('account') && <p className='text-error font-label-sm text-label-sm'>{error}</p>}
        <SubmitButton isSubmitting={isSubmitting} />
      </form>
    </section>
  );
};

export default AlertSetupForm;
