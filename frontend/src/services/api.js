import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1', // Adjust this to your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export const kycRequest = async (data) => {
  try {
    const response = await apiClient.post('/kyc', data);
    return response.data;
  } catch (error) {
    console.error('Error making KYC request:', error);
    throw error;
  }
};
