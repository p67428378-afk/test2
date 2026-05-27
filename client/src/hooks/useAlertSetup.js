import { useState } from 'react';
import { setupAlert, verifyOtp } from '../services/api';

const useAlertSetup = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const setup = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await setupAlert(formData);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || 'An unexpected error occurred.');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const verify = async (otpData) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await verifyOtp(otpData);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || 'An unexpected error occurred.');
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, error, data, setup, verify };
};

export default useAlertSetup;
