import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const generateCertificate = async ({ accountNumber, purpose }) => {
  const response = await apiClient.post('/certificates/balance', {
    accountNumber,
    purpose,
  }, {
    responseType: 'blob', // Important to handle the PDF response
  });
  return response.data;
};
