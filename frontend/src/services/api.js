import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000', // Assuming the backend runs on port 8000
  headers: {
    'Content-Type': 'application/json'
  }
});

export const generateStatement = async (accountNumber, startDate, endDate, format) => {
  try {
    const response = await apiClient.post('/statements/', {
      account_number: accountNumber,
      start_date: startDate,
      end_date: endDate,
      format: format
    });
    return response.data;
  } catch (error) {
    console.error('Error generating statement:', error);
    throw error;
  }
};
