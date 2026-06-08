import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const initiateMobileUpdate = async (accountNumber, newMobileNumber) => {
  const response = await api.post('/api/v1/mobile-update/initiate', {
    account_number: accountNumber,
    new_mobile_number: newMobileNumber,
  });
  return response.data;
};

export const verifyOldOTP = async (requestId, otp) => {
  const response = await api.post('/api/v1/mobile-update/verify-old-otp', {
    request_id: requestId,
    otp: otp,
  });
  return response.data;
};

export const verifyNewOTP = async (requestId, otp) => {
  const response = await api.post('/api/v1/mobile-update/verify-new-otp', {
    request_id: requestId,
    otp: otp,
  });
  return response.data;
};

export const getMobileUpdateStatus = async (requestId) => {
  const response = await api.get(`/api/v1/mobile-update/status/${requestId}`);
  return response.data;
};

export default api;
