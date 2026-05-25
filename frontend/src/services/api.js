
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const blockCard = async (request) => {
  const { data } = await apiClient.post('/cards/block', request);
  return data;
};
