import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default {
  generateInterestCertificate(customerId, financialYear) {
    return apiClient.post('/interest-certificate/', { customer_id: customerId, financial_year: financialYear }, { responseType: 'blob' });
  }
};
