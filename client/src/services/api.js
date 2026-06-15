import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8180';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const calculatePost = async (operand1, operand2, operator) => {
  const startTime = Date.now();
  try {
    const response = await api.post('/api/v1/calculate', {
      operand1: parseFloat(operand1),
      operand2: parseFloat(operand2),
      operator,
    });
    const duration = Date.now() - startTime;
    return {
      success: true,
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      duration,
      request: {
        method: 'POST',
        url: `${BASE_URL}/api/v1/calculate`,
        body: { operand1, operand2, operator },
      },
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    return {
      success: false,
      error: error.response?.data?.detail || error.message || 'An error occurred',
      status: error.response?.status || 500,
      statusText: error.response?.statusText || 'Error',
      duration,
      request: {
        method: 'POST',
        url: `${BASE_URL}/api/v1/calculate`,
        body: { operand1, operand2, operator },
      },
    };
  }
};

export const calculateGet = async (operand1, operand2, operator) => {
  const startTime = Date.now();
  try {
    const response = await api.get('/api/v1/calculate', {
      params: {
        operand1: parseFloat(operand1),
        operand2: parseFloat(operand2),
        operator,
      },
    });
    const duration = Date.now() - startTime;
    return {
      success: true,
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      duration,
      request: {
        method: 'GET',
        url: `${BASE_URL}/api/v1/calculate?operand1=${operand1}&operand2=${operand2}&operator=${encodeURIComponent(operator)}`,
        body: null,
      },
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    return {
      success: false,
      error: error.response?.data?.detail || error.message || 'An error occurred',
      status: error.response?.status || 500,
      statusText: error.response?.statusText || 'Error',
      duration,
      request: {
        method: 'GET',
        url: `${BASE_URL}/api/v1/calculate?operand1=${operand1}&operand2=${operand2}&operator=${encodeURIComponent(operator)}`,
        body: null,
      },
    };
  }
};
