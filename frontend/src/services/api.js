import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/',
});

export const getAccountSummary = () => {
  // MOCK: This is a mock API call. In a real application, this would
  // make a request to a backend server.
  return Promise.resolve({
    data: {
      account_holder_name: 'John Doe',
      account_number: '**** **** **** 1234',
      account_type: 'Savings Account',
      current_balance: 10000,
      currency: 'USD'
    }
  });
  // return apiClient.get('/api/v1/accounts/summary');
};
