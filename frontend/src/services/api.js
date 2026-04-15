import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getCreditCardOfferings = () => {
  return apiClient.get('/credit-cards/');
};

export const createApplication = (applicationData, accountStatement) => {
  const formData = new FormData();
  formData.append('application_data', JSON.stringify(applicationData));
  formData.append('account_statement', accountStatement);

  return apiClient.post('/applications/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
