import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const submitApplication = async (applicationData) => {
  try {
    const response = await apiClient.post('/applications/', applicationData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
