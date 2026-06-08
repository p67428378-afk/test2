import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const requestCertificate = async (accountNumber, otp, purpose) => {
  const response = await api.post('/api/v1/certificates', {
    account_number: accountNumber,
    otp: otp,
    purpose: purpose,
  });
  return response.data;
};

export const listCertificates = async (skip = 0, limit = 20) => {
  const response = await api.get('/api/v1/certificates', {
    params: { skip, limit },
  });
  return response.data;
};

export const getDownloadUrl = (id) => {
  return `${BASE_URL}/api/v1/certificates/${id}/download`;
};

export default api;
