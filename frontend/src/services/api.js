import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createPortfolio = (portfolio) => {
  return apiClient.post('/portfolios/', portfolio);
};

export const getPortfolio = (portfolioId) => {
  return apiClient.get(`/portfolios/${portfolioId}`);
};

export const assessRisk = (portfolioId) => {
  return apiClient.post(`/portfolios/${portfolioId}/assess-risk`);
};
